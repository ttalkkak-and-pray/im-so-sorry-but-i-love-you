/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useReflectionStore } from '../store';
import confessionData from '../../assets/confession.json';

export function InterrogationPage() {
  const navigate = useNavigate();
  const setNickname = useReflectionStore((state) => state.setNickname);
  const setCrime = useReflectionStore((state) => state.setCrime);

  const [step, setStep] = useState<'intro' | 'nickname' | 'question' | 'subQuestion' | 'result'>('intro');
  const [localNickname, setLocalNickname] = useState('');
  
  const [questionsPool, setQuestionsPool] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [noCount, setNoCount] = useState(0);
  const [shakeClass, setShakeClass] = useState('');
  const [shakeMessage, setShakeMessage] = useState('');
  
  const [subType, setSubType] = useState<'input' | 'branch' | null>(null);
  const [subData, setSubData] = useState<any>(null);
  const [subInput, setSubInput] = useState('');
  
  const [finalCrime, setFinalCrime] = useState<any>(null);

  useEffect(() => {
    // Initialize questions
    const q1 = confessionData.questions.find(q => q.id === 'q1');
    const others = confessionData.questions.filter(q => q.id !== 'q1');
    
    // Shuffle others
    const shuffled = [...others].sort(() => Math.random() - 0.5);
    setQuestionsPool(shuffled);
    setCurrentQuestion(q1);
  }, []);

  const handleStart = () => {
    setStep('nickname');
  };

  const handleNicknameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localNickname.trim()) {
      setNickname(localNickname.trim());
      setStep('question');
    }
  };

  const triggerShake = (count: number) => {
    const effect = confessionData.meta.shakeEffects.levels.find(l => l.noCount === count);
    if (effect) {
      setShakeClass(effect.shakeClass);
      setShakeMessage(effect.message);
      setTimeout(() => setShakeClass(''), 1000);
      
      if (effect.triggerForcedCrime) {
        handleConfirmCrime(confessionData.forcedNoCrime.crime);
      }
    }
  };

  const handleConfirmCrime = (crime: any, customInput?: string) => {
    let finalDescription = crime.description;
    if (crime.descriptionTemplate && customInput) {
      finalDescription = crime.descriptionTemplate.replace('{input}', customInput);
    }
    
    // Attach theme colors
    const themeKey = crime.theme as keyof typeof confessionData.themes;
    const themeObj = confessionData.themes[themeKey] || confessionData.themes.manuscript;
    
    const crimeResult = {
      ...crime,
      description: finalDescription,
      themeColors: themeObj.colors,
      themeLabel: themeObj.label,
      stampText: themeObj.stampText,
    };
    
    setFinalCrime(crimeResult);
    setCrime(crimeResult);
    setStep('result');
  };

  const handleAnswer = (type: 'yes' | 'no') => {
    const answerData = currentQuestion.answers[type];
    
    if (!answerData) {
      // Missing data, just move to random
      processNextRandom();
      return;
    }

    if (answerData.crime && answerData.type !== 'input' && answerData.type !== 'branch') {
      handleConfirmCrime(answerData.crime);
      return;
    }

    if (answerData.type === 'input') {
      setSubType('input');
      setSubData(answerData);
      setStep('subQuestion');
      return;
    }

    if (answerData.type === 'branch') {
      setSubType('branch');
      setSubData(answerData);
      setStep('subQuestion');
      return;
    }

    if (type === 'no') {
      const newCount = noCount + 1;
      setNoCount(newCount);
      triggerShake(newCount);
      
      // If triggerForcedCrime was called inside triggerShake, step would change to result
      // But we need to ensure we don't proceed if forced
      const effect = confessionData.meta.shakeEffects.levels.find(l => l.noCount === newCount);
      if (effect && effect.triggerForcedCrime) return;

      if (answerData.next === 'random') {
        processNextRandom();
      }
    }
  };

  const processNextRandom = () => {
    if (questionsPool.length > 0) {
      const nextQ = questionsPool[0];
      setQuestionsPool(questionsPool.slice(1));
      setCurrentQuestion(nextQ);
    } else {
      // Fallback if we run out of questions
      handleConfirmCrime(confessionData.finalFallback.crime);
    }
  };

  const handleSubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subType === 'input' && subInput.trim()) {
      handleConfirmCrime(subData.crime, subInput.trim());
    }
  };

  const handleBranchSelect = (option: any) => {
    handleConfirmCrime(option.crime);
  };

  const handleGoToConfession = () => {
    // Optionally log prompt if using a backend, but per user request, we skip AI usage
    navigate('/confession');
  };

  return (
    <div css={containerStyle}>
      <div css={wrapperStyle}>
        
        {step === 'intro' && (
          <div css={cardStyle}>
            <h1 css={titleStyle}>진정성 100% 반성문 봇</h1>
            <p css={descStyle}>당신은 이미 유죄입니다.<br/>어떤 변명도 통하지 않습니다. 심문을 시작합니다.</p>
            <button css={primaryBtnStyle} onClick={handleStart}>심문 시작</button>
          </div>
        )}

        {step === 'nickname' && (
          <div css={cardStyle}>
            <h2 css={titleStyle}>신원 확인</h2>
            <form onSubmit={handleNicknameSubmit} css={formStyle}>
              <label css={labelStyle}>이름(닉네임)을 밝히시오.</label>
              <input 
                css={inputStyle} 
                autoFocus
                value={localNickname}
                onChange={e => setLocalNickname(e.target.value)}
                placeholder="홍길동"
              />
              <button css={primaryBtnStyle} type="submit" disabled={!localNickname.trim()}>확인</button>
            </form>
          </div>
        )}

        {step === 'question' && currentQuestion && (
          <div css={[cardStyle, getShakeStyle(shakeClass)]}>
            <div css={badgeStyle}>심문 중...</div>
            <h2 css={questionStyle}>{currentQuestion.question}</h2>
            {currentQuestion.hint && <p css={hintStyle}>{currentQuestion.hint}</p>}
            
            {shakeMessage && <div css={errorMsgStyle}>{shakeMessage}</div>}

            <div css={btnGroupStyle}>
              <button css={primaryBtnStyle} onClick={() => handleAnswer('yes')}>예</button>
              <button css={secondaryBtnStyle} onClick={() => handleAnswer('no')}>아니오</button>
            </div>
          </div>
        )}

        {step === 'subQuestion' && subData && (
          <div css={cardStyle}>
            <h2 css={questionStyle}>{subData.prompt}</h2>
            
            {subType === 'input' && (
              <form onSubmit={handleSubSubmit} css={formStyle}>
                <input 
                  css={inputStyle}
                  autoFocus
                  type={subData.inputType || 'text'}
                  placeholder={subData.placeholder || ''}
                  value={subInput}
                  onChange={e => setSubInput(e.target.value)}
                />
                <button css={primaryBtnStyle} type="submit" disabled={!subInput.trim()}>제출</button>
              </form>
            )}

            {subType === 'branch' && (
              <div css={btnGroupVerticalStyle}>
                {subData.options.map((opt: any, idx: number) => (
                  <button key={idx} css={secondaryBtnStyle} onClick={() => handleBranchSelect(opt)}>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 'result' && finalCrime && (
          <div css={resultCardStyle}>
            <div css={emojiStyle}>{finalCrime.emoji}</div>
            <h1 css={crimeTitleStyle}>{finalCrime.title}</h1>
            <div css={severityStyle}>형량: {finalCrime.severity}</div>
            <p css={crimeDescStyle}>{finalCrime.description}</p>
            
            {finalCrime.additionalCharges && (
              <div css={chargesStyle}>
                <strong>추가 혐의:</strong>
                <ul>
                  {finalCrime.additionalCharges.map((c: string, i: number) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            )}

            <div css={themeBadgeStyle}>적용 테마: {finalCrime.themeLabel}</div>

            <button css={dangerBtnStyle} onClick={handleGoToConfession}>반성문 작성하러 가기</button>
          </div>
        )}

      </div>
    </div>
  );
}

// ----- Styles -----

const containerStyle = css`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-container-lowest);
  padding: 20px;
`;

const wrapperStyle = css`
  width: 100%;
  max-width: 500px;
`;

const cardStyle = css`
  background: var(--surface);
  border: 2px solid var(--text);
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 8px 8px 0 var(--surface-container-high);
  transition: transform 0.1s;
`;

const titleStyle = css`
  font-family: 'Noto Serif KR', serif;
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  color: var(--text);
  margin: 0;
`;

const descStyle = css`
  text-align: center;
  color: var(--text);
  font-size: 16px;
  opacity: 0.8;
  line-height: 1.6;
`;

const questionStyle = css`
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
  text-align: center;
  line-height: 1.4;
  word-break: keep-all;
`;

const hintStyle = css`
  text-align: center;
  color: var(--text);
  opacity: 0.6;
  font-size: 14px;
`;

const badgeStyle = css`
  align-self: center;
  background: var(--text);
  color: var(--surface);
  font-size: 12px;
  padding: 4px 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const formStyle = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const labelStyle = css`
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
`;

const inputStyle = css`
  padding: 16px;
  font-size: 18px;
  border: 2px solid var(--text);
  background: transparent;
  outline: none;
  &:focus {
    background: var(--primary-highlight);
  }
`;

const btnGroupStyle = css`
  display: flex;
  gap: 12px;
  margin-top: 10px;
  button {
    flex: 1;
  }
`;

const btnGroupVerticalStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const primaryBtnStyle = css`
  background: var(--primary);
  color: var(--surface);
  border: 2px solid var(--text);
  padding: 16px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.1s;
  &:hover:not(:disabled) {
    transform: translate(-2px, -2px);
    box-shadow: 4px 4px 0 var(--text);
  }
  &:active:not(:disabled) {
    transform: translate(0, 0);
    box-shadow: none;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const secondaryBtnStyle = css`
  background: transparent;
  color: var(--text);
  border: 2px solid var(--text);
  padding: 16px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: var(--surface-container-high);
  }
`;

const dangerBtnStyle = css`
  ${primaryBtnStyle};
  background: var(--secondary);
  color: white;
  margin-top: 20px;
`;

const errorMsgStyle = css`
  color: var(--secondary);
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  animation: pulse 0.5s infinite;
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const resultCardStyle = css`
  ${cardStyle};
  border-color: var(--secondary);
  text-align: center;
`;

const emojiStyle = css`
  font-size: 64px;
  margin-bottom: -10px;
`;

const crimeTitleStyle = css`
  font-family: 'Noto Serif KR', serif;
  font-size: 32px;
  color: var(--secondary);
  margin: 0;
`;

const severityStyle = css`
  display: inline-block;
  background: var(--secondary);
  color: white;
  padding: 4px 12px;
  font-size: 14px;
  font-weight: bold;
  align-self: center;
`;

const crimeDescStyle = css`
  background: var(--surface-container-high);
  padding: 20px;
  font-size: 16px;
  line-height: 1.6;
  border-left: 4px solid var(--secondary);
  text-align: left;
`;

const chargesStyle = css`
  text-align: left;
  font-size: 14px;
  ul {
    margin: 8px 0 0;
    padding-left: 20px;
    color: var(--secondary);
  }
`;

const themeBadgeStyle = css`
  font-size: 14px;
  opacity: 0.7;
`;

// Dynamic shake animations
const getShakeStyle = (shakeClass: string) => {
  if (!shakeClass) return css``;
  
  let x = '0px';
  if (shakeClass === 'shake-sm') x = '2px';
  if (shakeClass === 'shake-md') x = '5px';
  if (shakeClass === 'shake-lg') x = '8px';
  if (shakeClass === 'shake-xl') x = '12px';
  if (shakeClass === 'shake-max') x = '20px';

  return css`
    animation: shakeAnim 0.1s infinite;
    @keyframes shakeAnim {
      0% { transform: translateX(0); }
      25% { transform: translateX(${x}); }
      50% { transform: translateX(0); }
      75% { transform: translateX(-${x}); }
      100% { transform: translateX(0); }
    }
  `;
};

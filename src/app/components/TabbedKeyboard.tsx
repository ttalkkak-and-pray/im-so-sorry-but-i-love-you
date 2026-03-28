/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { CONSONANTS, KOREAN_CHARACTERS, SPECIAL_CHARS } from '../constants';
import { useReflectionStore } from '../store';

interface TabbedKeyboardProps {
  onPeriodClick: () => void;
  onDeleteOne: () => void;
  onDeleteAll: () => void;
}

export function TabbedKeyboard({
  onPeriodClick,
  onDeleteOne,
  onDeleteAll
}: TabbedKeyboardProps) {
  const [activeTab, setActiveTab] = useState<'korean' | 'number' | 'special'>('korean');
  const [selectedConsonant, setSelectedConsonant] = useState<string | null>(null);
  const [shuffledNumbers, setShuffledNumbers] = useState<string[]>(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);
  const [shuffledSpecialChars, setShuffledSpecialChars] = useState<string[]>([...SPECIAL_CHARS]);
  
  const addCharacter = useReflectionStore(state => state.addCharacter);
  
  // 숫자 배열 섞기
  const shuffleNumbers = () => {
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    setShuffledNumbers(numbers);
  };
  
  // 특수문자 배열 섞기
  const shuffleSpecialChars = () => {
    const chars = [...SPECIAL_CHARS];
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    setShuffledSpecialChars(chars);
  };
  
  const handleNumberClick = (num: string) => {
    addCharacter(num);
    shuffleNumbers(); // 숫자 선택 후 재배열
  };
  
  const handleSpecialCharClick = (char: string) => {
    if (char === '.') {
      onPeriodClick();
    } else {
      addCharacter(char);
    }
    shuffleSpecialChars(); // 특수문자 선택 후 재배열
  };
  
  const handleCharacterClick = (char: string) => {
    addCharacter(char);
  };
  
  return (
    <div css={containerStyle}>
      {/* 탭 메뉴 */}
      <div css={tabMenuStyle}>
        <button
          css={tabButtonStyle(activeTab === 'korean')}
          onClick={() => setActiveTab('korean')}
        >
          한글
        </button>
        <button
          css={tabButtonStyle(activeTab === 'number')}
          onClick={() => setActiveTab('number')}
        >
          숫자
        </button>
        <button
          css={tabButtonStyle(activeTab === 'special')}
          onClick={() => setActiveTab('special')}
        >
          특수문자
        </button>
        <button
          css={utilityTabButtonStyle}
          onClick={() => addCharacter(' ')}
        >
          띄어쓰기
        </button>
        <button
          css={utilityTabButtonStyle}
          onClick={() => addCharacter('\n')}
        >
          줄바꿈
        </button>
        <button
          css={deleteButtonStyle('warning')}
          onClick={onDeleteOne}
        >
          삭제
        </button>
        <button
          css={deleteButtonStyle('danger')}
          onClick={onDeleteAll}
        >
          전체 삭제
        </button>
      </div>
      
      {/* 탭 컨텐츠 */}
      <div css={tabContentStyle}>
        {activeTab === 'korean' && (
          <div css={koreanTabStyle}>
            <div css={consonantTabsStyle}>
              {CONSONANTS.map(consonant => (
                <button
                  key={consonant}
                  css={consonantTabButtonStyle(selectedConsonant === consonant)}
                  onClick={() => setSelectedConsonant(consonant)}
                >
                  {consonant}
                </button>
              ))}
            </div>
            
            {selectedConsonant && (
              <div css={characterGridStyle}>
                {KOREAN_CHARACTERS[selectedConsonant]?.map((char, index) => (
                  <button
                    key={`${char}-${index}`}
                    css={characterButtonStyle}
                    onClick={() => handleCharacterClick(char)}
                  >
                    {char}
                  </button>
                ))}
              </div>
            )}
            
            {!selectedConsonant && (
              <div css={placeholderStyle}>
                자음을 선택하여 글자를 입력하세요
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'number' && (
          <div css={numberTabStyle}>
            <div css={phoneNumberGridStyle}>
              {shuffledNumbers.map((num, index) => (
                <button
                  key={`${num}-${index}`}
                  css={numberButtonStyle}
                  onClick={() => handleNumberClick(num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'special' && (
          <div css={specialTabStyle}>
            <div css={specialGridStyle}>
              {shuffledSpecialChars.map((char, index) => (
                <button
                  key={`${char}-${index}`}
                  css={specialButtonStyle(char === '.')}
                  onClick={() => handleSpecialCharClick(char)}
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const containerStyle = css`
  width: 100%;
  background: var(--surface-container-low);
  border: 2px solid var(--text);
`;

const tabMenuStyle = css`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 2px solid var(--text);
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const tabButtonStyle = (isActive: boolean) => css`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding: 16px 12px;
  background: ${isActive ? 'var(--primary)' : 'var(--surface)'};
  color: ${isActive ? 'var(--surface)' : 'var(--text)'};
  border-right: 1px solid var(--text);
  border-bottom: none;
  cursor: pointer;
  transition: all 0.15s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  &:hover {
    background: ${isActive ? 'var(--primary)' : 'var(--primary-highlight)'};
  }
  
  @media (max-width: 768px) {
    font-size: 12px;
    padding: 12px 8px;
  }
`;

const utilityTabButtonStyle = css`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding: 16px 12px;
  background: var(--surface);
  color: var(--text);
  border-right: 1px solid var(--text);
  border-bottom: none;
  cursor: pointer;
  transition: all 0.15s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  &:hover {
    background: var(--primary-highlight);
  }
  
  &:active {
    background: var(--primary);
    color: var(--surface);
  }
  
  @media (max-width: 768px) {
    font-size: 12px;
    padding: 12px 8px;
  }
`;

const deleteButtonStyle = (variant: 'warning' | 'danger') => css`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding: 16px 12px;
  background: ${variant === 'danger' ? 'var(--secondary)' : 'var(--surface)'};
  color: ${variant === 'danger' ? 'var(--surface)' : 'var(--text)'};
  border-right: 1px solid var(--text);
  border-bottom: none;
  cursor: pointer;
  transition: all 0.15s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  &:last-child {
    border-right: none;
  }
  
  &:hover {
    background: ${variant === 'danger' ? 'var(--secondary)' : 'var(--primary-highlight)'};
  }
  
  &:active {
    opacity: 0.8;
  }
  
  @media (max-width: 768px) {
    font-size: 12px;
    padding: 12px 8px;
  }
`;

const tabContentStyle = css`
  min-height: 300px;
  padding: 20px;
  
  @media (max-width: 768px) {
    min-height: 250px;
    padding: 16px;
  }
`;

const koreanTabStyle = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const consonantTabsStyle = css`
  display: grid;
  grid-template-columns: repeat(13, 1fr);
  gap: 4px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(7, 1fr);
  }
`;

const consonantTabButtonStyle = (isSelected: boolean) => css`
  font-family: 'Noto Serif KR', serif;
  font-size: 16px;
  font-weight: 600;
  padding: 12px 8px;
  background: ${isSelected ? 'var(--primary)' : 'var(--surface)'};
  color: ${isSelected ? 'var(--surface)' : 'var(--text)'};
  border: 1px solid var(--text);
  cursor: pointer;
  transition: all 0.15s ease;
  
  &:hover {
    background: ${isSelected ? 'var(--primary)' : 'var(--primary-highlight)'};
  }
  
  &:active {
    transform: translate(1px, 1px);
  }
  
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px 6px;
  }
`;

const characterGridStyle = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
  gap: 6px;
  max-height: 240px;
  overflow-y: auto;
  padding: 12px;
  background: var(--surface);
  border: 1px solid var(--text);
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--surface-container-low);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--primary);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(38px, 1fr));
    max-height: 180px;
  }
`;

const characterButtonStyle = css`
  font-family: 'Noto Serif KR', serif;
  font-size: 16px;
  padding: 10px;
  background: var(--surface-container-lowest);
  color: var(--text);
  border: 1px solid var(--text);
  cursor: pointer;
  transition: all 0.15s ease;
  
  &:hover {
    background: var(--primary-highlight);
    transform: scale(1.05);
  }
  
  &:active {
    background: var(--primary);
    color: var(--surface);
    transform: scale(0.95);
  }
  
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px;
  }
`;

const placeholderStyle = css`
  text-align: center;
  padding: 60px 20px;
  color: var(--text);
  opacity: 0.4;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  border: 1px solid var(--text);
  background: var(--surface);
  
  @media (max-width: 768px) {
    padding: 40px 16px;
    font-size: 12px;
  }
`;

const numberTabStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const phoneNumberGridStyle = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 12px;
  width: 100%;
  max-width: 400px;
  
  button:last-child {
    grid-column: 2;
  }
  
  @media (max-width: 768px) {
    gap: 10px;
    max-width: 300px;
  }
`;

const numberButtonStyle = css`
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 600;
  padding: 20px;
  background: var(--surface);
  color: var(--text);
  border: 2px solid var(--text);
  cursor: pointer;
  transition: all 0.15s ease;
  
  &:hover {
    background: var(--primary-highlight);
  }
  
  &:active {
    background: var(--primary);
    color: var(--surface);
    transform: scale(0.95);
  }
  
  @media (max-width: 768px) {
    font-size: 20px;
    padding: 16px;
  }
`;

const specialTabStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const specialGridStyle = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 8px;
  width: 100%;
  max-width: 800px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  }
`;

const specialButtonStyle = (isPeriod: boolean) => css`
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  padding: 16px;
  background: ${isPeriod ? 'var(--primary)' : 'var(--surface)'};
  color: ${isPeriod ? 'var(--surface)' : 'var(--text)'};
  border: 2px solid var(--text);
  cursor: pointer;
  transition: all 0.15s ease;
  
  &:hover {
    background: var(--primary-highlight);
    color: var(--text);
  }
  
  &:active {
    background: var(--primary);
    color: var(--surface);
    transform: scale(0.95);
  }
  
  @media (max-width: 768px) {
    font-size: 16px;
    padding: 12px;
  }
`;

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useReflectionStore } from '../store';

export function SincerityScore() {
  const score = useReflectionStore(state => state.getSincerityScore());
  const clickCount = useReflectionStore(state => state.clickCount);
  const deleteCount = useReflectionStore(state => state.deleteCount);
  const resetCount = useReflectionStore(state => state.resetCount);
  const elapsedTime = useReflectionStore(state => state.getElapsedTime());
  const charCount = useReflectionStore(state => state.getCharacterCount());
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs}초`;
  };
  
  const getScoreGrade = (score: number) => {
    if (score >= 500) return { grade: 'S+', color: 'var(--primary)', message: '완벽한 진정성!' };
    if (score >= 400) return { grade: 'S', color: 'var(--primary)', message: '매우 진심입니다' };
    if (score >= 300) return { grade: 'A', color: '#047858', message: '진심이 느껴집니다' };
    if (score >= 200) return { grade: 'B', color: '#EA580C', message: '조금 더 노력해요' };
    if (score >= 100) return { grade: 'C', color: '#DC2626', message: '진정성 부족' };
    return { grade: 'D', color: 'var(--secondary)', message: '더욱 집중하세요' };
  };
  
  const { grade, color, message } = getScoreGrade(score);
  
  return (
    <div css={containerStyle}>
      <div css={headerStyle}>
        <h3 css={titleStyle}>진정성 지수</h3>
        <div css={scoreDisplayStyle}>
          <span css={scoreValueStyle(color)}>{score}</span>
          <span css={gradeStyle(color)}>{grade}</span>
        </div>
        <div css={messageStyle(color)}>{message}</div>
      </div>
      
      <div css={statsGridStyle}>
        <div css={statItemStyle}>
          <div css={statLabelStyle}>총 클릭</div>
          <div css={statValueStyle}>{clickCount}</div>
        </div>
        
        <div css={statItemStyle}>
          <div css={statLabelStyle}>작성 시간</div>
          <div css={statValueStyle}>{formatTime(elapsedTime)}</div>
        </div>
        
        <div css={statItemStyle}>
          <div css={statLabelStyle}>글자 수</div>
          <div css={statValueStyle}>{charCount}</div>
        </div>
        
        <div css={statItemStyle}>
          <div css={statLabelStyle}>수정 횟수</div>
          <div css={statValueStyle(deleteCount > 0, 'positive')}>{deleteCount}</div>
        </div>
        
        <div css={statItemStyle}>
          <div css={statLabelStyle}>리셋 횟수</div>
          <div css={statValueStyle(resetCount > 0, 'negative')}>{resetCount}</div>
        </div>
      </div>
    </div>
  );
}

const containerStyle = css`
  width: 100%;
  background: var(--surface-container-low);
  border: 2px solid var(--text);
  overflow: hidden;
`;

const headerStyle = css`
  padding: 20px;
  background: var(--surface-container);
  border-bottom: 2px solid var(--text);
  text-align: center;
`;

const titleStyle = css`
  font-family: 'Noto Serif KR', serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 12px 0;
  letter-spacing: 0.1em;
`;

const scoreDisplayStyle = css`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const scoreLabelStyle = css`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: var(--text);
  opacity: 0.7;
`;

const scoreValueStyle = (color: string) => css`
  font-family: 'Inter', sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: ${color};
  line-height: 1;
`;

const gradeStyle = (color: string) => css`
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: ${color};
  border: 2px solid ${color};
  padding: 2px 8px;
  line-height: 1;
`;

const messageStyle = (color: string) => css`
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${color};
`;

const statsGridStyle = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;

const statItemStyle = css`
  padding: 14px;
  text-align: center;
  border-right: 1px solid var(--text);
  border-bottom: 1px solid var(--text);
  background: var(--surface);
  
  &:nth-of-type(2n) {
    border-right: none;
  }
  
  &:nth-of-type(5), &:nth-of-type(6) {
    border-bottom: none;
  }
`;

const statLabelStyle = css`
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: var(--text);
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
`;

const statValueStyle = (isWarning?: boolean, type?: 'positive' | 'negative') => css`
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: ${isWarning ? (type === 'positive' ? 'var(--primary)' : 'var(--secondary)') : 'var(--primary)'};
`;
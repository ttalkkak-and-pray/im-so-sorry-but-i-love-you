/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useRef, useEffect } from 'react';
import { useReflectionStore } from '../store';

export function ReflectionTextArea() {
  const text = useReflectionStore(state => state.text);
  const charCount = useReflectionStore(state => state.getCharacterCount());
  const cursorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 반응형 칸 수 결정 (실제로는 미디어쿼리로 CSS에서 제어하지만, 계산을 위해 기본값 사용)
  const CHARS_PER_LINE = 20;
  
  // 줄바꿈을 기준으로 텍스트를 줄 단위로 분리
  const paragraphs = text.split('\n');
  
  // 각 문단을 칸 수에 맞춰 시각적 줄로 나누기
  const visualLines: { text: string; isLastInDocument: boolean; originalLength: number }[] = [];
  
  paragraphs.forEach((paragraph, pIndex) => {
    if (paragraph.length === 0) {
      // 빈 줄은 그대로 표시
      visualLines.push({
        text: '',
        isLastInDocument: pIndex === paragraphs.length - 1,
        originalLength: 0
      });
    } else {
      // 긴 문단은 CHARS_PER_LINE 칸씩 나눔
      for (let i = 0; i < paragraph.length; i += CHARS_PER_LINE) {
        const chunk = paragraph.slice(i, i + CHARS_PER_LINE);
        const isLastChunk = i + CHARS_PER_LINE >= paragraph.length;
        const isLastParagraph = pIndex === paragraphs.length - 1;
        
        visualLines.push({
          text: chunk,
          isLastInDocument: isLastParagraph && isLastChunk,
          originalLength: chunk.length
        });
      }
    }
  });
  
  // 커서가 있는 위치로 부드럽게 스크롤 (화면이 위로 올라가지 않도록)
  useEffect(() => {
    if (cursorRef.current && containerRef.current) {
      const cursor = cursorRef.current;
      const container = containerRef.current;
      
      const cursorRect = cursor.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      // 커서가 컨테이너 하단 밖에 있을 때만 스크롤
      if (cursorRect.bottom > containerRect.bottom) {
        cursor.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      }
    }
  }, [text]);
  
  // 물리 키보드 입력 차단
  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();
  };
  
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };
  
  return (
    <div css={containerStyle}>
      <div css={headerStyle}>
        <h1 css={titleStyle}>반 성 문</h1>
        <div css={metaStyle}>
          작성자: __________ | 날짜: {new Date().toLocaleDateString('ko-KR')}
        </div>
      </div>
      
      <div css={paperStyle} ref={containerRef}>
        <div css={gridContainerStyle}>
          {/* 각 시각적 줄을 렌더링 */}
          {visualLines.map((line, lineIndex) => {
            const characters = line.text.split('');
            
            return (
              <div key={lineIndex} css={lineContainerStyle}>
                {Array.from({ length: CHARS_PER_LINE }).map((_, charIndex) => (
                  <div key={`${lineIndex}-${charIndex}`} css={gridCellStyle}>
                    <span css={characterStyle}>
                      {characters[charIndex] || ''}
                    </span>
                    {/* 마지막 줄의 마지막 글자 뒤에 커서 표시 */}
                    {line.isLastInDocument && charIndex === characters.length && (
                      <div ref={cursorRef} css={cursorStyle}></div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
          
          {/* 빈 줄 추가 (최소 높이 확보) */}
          {visualLines.length < 8 && Array.from({ length: 8 - visualLines.length }).map((_, idx) => (
            <div key={`empty-${idx}`} css={lineContainerStyle}>
              {Array.from({ length: CHARS_PER_LINE }).map((_, charIdx) => (
                <div key={charIdx} css={gridCellStyle}>
                  <span css={characterStyle}></span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div css={footerStyle}>
        <span css={charCountStyle(charCount >= 50)}>
          {charCount} / 50자 {charCount < 50 && '(최소 50자 이상)'}
        </span>
      </div>
    </div>
  );
}

const containerStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const headerStyle = css`
  text-align: center;
  margin-bottom: 20px;
  padding: 20px;
  background: var(--surface-container-low);
  border: 1px solid var(--text);
  
  @media (max-width: 768px) {
    margin-bottom: 16px;
    padding: 16px;
  }
`;

const titleStyle = css`
  font-family: 'Noto Serif KR', serif;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 0.5em;
  color: var(--text);
  margin: 0 0 12px 0;
  
  @media (max-width: 768px) {
    font-size: 24px;
    letter-spacing: 0.3em;
  }
`;

const metaStyle = css`
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: var(--text);
  opacity: 0.7;
  
  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

const paperStyle = css`
  flex: 1;
  background: var(--surface);
  border: 2px solid var(--text);
  padding: 24px;
  overflow-y: auto;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.1);
  max-height: 220px;
  
  &::-webkit-scrollbar {
    width: 10px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--surface-container-low);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--primary);
    border: 1px solid var(--text);
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    max-height: 180px;
  }
`;

const gridContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
`;

const lineContainerStyle = css`
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  gap: 0;
  width: 100%;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(15, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(10, 1fr);
  }
`;

const gridCellStyle = css`
  aspect-ratio: 1;
  border: 1px solid rgba(4, 100, 100, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: var(--surface);
  min-width: 28px;
  min-height: 28px;
  
  @media (max-width: 768px) {
    min-width: 24px;
    min-height: 24px;
  }
`;

const characterStyle = css`
  font-family: 'Noto Serif KR', serif;
  font-size: 16px;
  font-weight: 500;
  color: var(--text);
  line-height: 1;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const footerStyle = css`
  margin-top: 16px;
  text-align: right;
  
  @media (max-width: 768px) {
    margin-top: 12px;
  }
`;

const charCountStyle = (isValid: boolean) => css`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: ${isValid ? 'var(--primary)' : 'var(--secondary)'};
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const cursorStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px solid var(--primary);
  background: rgba(4, 100, 100, 0.1);
  pointer-events: none;
  animation: blink 1s infinite;
  
  @keyframes blink {
    0%, 50% {
      opacity: 1;
    }
    51%, 100% {
      opacity: 0.3;
    }
  }
`;

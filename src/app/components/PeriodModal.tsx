/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { useReflectionStore } from '../store';

interface PeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PeriodModal({ isOpen, onClose }: PeriodModalProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [escapeCount, setEscapeCount] = useState(0);
  const [maxEscapes] = useState(Math.floor(Math.random() * 5) + 1); // 1-5번 랜덤
  const [isClickable, setIsClickable] = useState(false);
  const addCharacter = useReflectionStore(state => state.addCharacter);
  
  // 모달이 열릴 때마다 초기화
  useEffect(() => {
    if (isOpen) {
      setPosition({ x: 50, y: 50 });
      setEscapeCount(0);
      setIsClickable(false);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const handleMouseEnter = () => {
    if (isClickable) return;
    
    if (escapeCount < maxEscapes) {
      // 도망가기
      const newX = Math.random() * 70 + 15; // 15-85%
      const newY = Math.random() * 70 + 15;
      setPosition({ x: newX, y: newY });
      setEscapeCount(prev => prev + 1);
    } else {
      // 클릭 가능하게 변경
      setIsClickable(true);
    }
  };
  
  const handleClick = () => {
    if (isClickable) {
      addCharacter('.');
      onClose();
    }
  };
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // 백드롭 클릭 시 모달 닫지 않음 (마침표를 입력해야 닫힘)
    }
  };
  
  return (
    <div css={backdropStyle} onClick={handleBackdropClick}>
      <div css={modalStyle}>
        <div css={modalHeaderStyle}>
          <h2 css={modalTitleStyle}>마침표 입력하기</h2>
          <p css={modalDescStyle}>
            {isClickable 
              ? '이제 클릭할 수 있습니다!' 
              : '마침표를 잡으려면 마우스를 올려보세요...'}
          </p>
        </div>
        
        <div css={areaStyle}>
          <button
            css={periodButtonStyle(isClickable)}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`
            }}
            onMouseEnter={handleMouseEnter}
            onClick={handleClick}
          >
            .
          </button>
        </div>
        
        <div css={modalFooterStyle}>
          <button css={cancelButtonStyle} onClick={onClose}>
            포기하기
          </button>
        </div>
      </div>
    </div>
  );
}

const backdropStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const modalStyle = css`
  background: var(--surface);
  border: 3px solid var(--text);
  width: 90%;
  max-width: 600px;
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.3);
`;

const modalHeaderStyle = css`
  padding: 24px;
  background: var(--surface-container-low);
  border-bottom: 2px solid var(--text);
  text-align: center;
`;

const modalTitleStyle = css`
  font-family: 'Noto Serif KR', serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 8px 0;
  letter-spacing: 0.1em;
`;

const modalDescStyle = css`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: var(--text);
  opacity: 0.8;
  margin: 0;
`;

const areaStyle = css`
  position: relative;
  height: 300px;
  background: var(--surface);
  overflow: hidden;
`;

const periodButtonStyle = (isClickable: boolean) => css`
  position: absolute;
  transform: translate(-50%, -50%);
  font-family: 'Inter', sans-serif;
  font-size: 48px;
  font-weight: 900;
  width: 80px;
  height: 80px;
  background: ${isClickable ? 'var(--primary)' : 'var(--secondary)'};
  color: var(--surface);
  border: 3px solid var(--text);
  cursor: ${isClickable ? 'pointer' : 'default'};
  transition: left 0.3s ease, top 0.3s ease, transform 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.3);
  
  ${isClickable && `
    animation: success-pulse 1s ease-in-out infinite;
    
    &:hover {
      transform: translate(-50%, -50%) scale(1.1);
    }
    
    &:active {
      transform: translate(-50%, -50%) scale(0.95);
    }
  `}
  
  @keyframes success-pulse {
    0%, 100% { box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.3); }
    50% { box-shadow: 3px 3px 20px var(--primary); }
  }
`;

const modalFooterStyle = css`
  padding: 20px;
  background: var(--surface-container-low);
  border-top: 2px solid var(--text);
  display: flex;
  justify-content: center;
`;

const cancelButtonStyle = css`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 24px;
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--text);
  cursor: pointer;
  transition: all 0.15s ease;
  
  &:hover {
    background: var(--text);
    color: var(--surface);
  }
`;

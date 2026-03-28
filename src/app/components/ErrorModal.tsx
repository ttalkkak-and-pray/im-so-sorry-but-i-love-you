/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

interface ErrorModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export function ErrorModal({ isOpen, title, message, onClose }: ErrorModalProps) {
  if (!isOpen) return null;
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div css={backdropStyle} onClick={handleBackdropClick}>
      <div css={modalStyle}>
        <div css={headerStyle}>
          <h2 css={titleStyle}>⚠️ {title}</h2>
        </div>
        
        <div css={contentStyle}>
          <p css={messageStyle}>{message}</p>
        </div>
        
        <div css={footerStyle}>
          <button css={buttonStyle} onClick={onClose}>
            확인
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
  animation: fadeIn 0.2s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const modalStyle = css`
  background: var(--surface);
  border: 3px solid var(--text);
  width: 90%;
  max-width: 480px;
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.3);
  animation: shake 0.5s ease;
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;

const headerStyle = css`
  padding: 24px;
  background: var(--secondary);
  color: var(--surface);
  border-bottom: 2px solid var(--text);
`;

const titleStyle = css`
  font-family: 'Noto Serif KR', serif;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.05em;
`;

const contentStyle = css`
  padding: 32px 24px;
  background: var(--surface);
`;

const messageStyle = css`
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  color: var(--text);
  margin: 0;
  white-space: pre-line;
`;

const footerStyle = css`
  padding: 20px;
  background: var(--surface-container-low);
  border-top: 2px solid var(--text);
  display: flex;
  justify-content: center;
`;

const buttonStyle = css`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 32px;
  background: var(--secondary);
  color: var(--surface);
  border: 2px solid var(--text);
  cursor: pointer;
  transition: all 0.15s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 3px 3px 0 var(--text);
  }
  
  &:active {
    transform: translate(0, 0);
    box-shadow: 1px 1px 0 var(--text);
  }
`;

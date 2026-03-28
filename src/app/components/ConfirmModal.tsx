/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning';
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  variant = 'warning'
}: ConfirmModalProps) {
  if (!isOpen) return null;
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };
  
  return (
    <div css={backdropStyle} onClick={handleBackdropClick}>
      <div css={modalStyle}>
        <div css={headerStyle(variant)}>
          <h2 css={titleStyle}>{title}</h2>
        </div>
        
        <div css={contentStyle}>
          <p css={messageStyle}>{message}</p>
        </div>
        
        <div css={footerStyle}>
          <button css={buttonStyle('cancel')} onClick={onCancel}>
            {cancelText}
          </button>
          <button css={buttonStyle(variant)} onClick={onConfirm}>
            {confirmText}
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
  animation: slideUp 0.2s ease;
  
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const headerStyle = (variant: string) => css`
  padding: 24px;
  background: ${variant === 'danger' ? 'var(--secondary)' : 'var(--primary)'};
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
  gap: 12px;
  justify-content: flex-end;
`;

const buttonStyle = (variant: string) => css`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 24px;
  background: ${
    variant === 'danger' ? 'var(--secondary)' : 
    variant === 'warning' ? 'var(--primary)' : 
    'var(--surface)'
  };
  color: ${variant === 'cancel' ? 'var(--text)' : 'var(--surface)'};
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

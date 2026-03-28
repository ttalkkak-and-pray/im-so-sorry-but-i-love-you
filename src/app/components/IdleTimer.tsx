/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useReflectionStore } from '../store';
import { IDLE_TIMEOUT } from '../constants';

interface IdleTimerProps {
  onTimeout: () => void;
}

export function IdleTimer({ onTimeout }: IdleTimerProps) {
  const [countdown, setCountdown] = useState(IDLE_TIMEOUT / 1000);
  const lastActivityTime = useReflectionStore(state => state.lastActivityTime);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - lastActivityTime;
      const remaining = Math.max(0, IDLE_TIMEOUT - elapsed);
      const seconds = Math.ceil(remaining / 1000);
      
      setCountdown(seconds);
      
      if (remaining <= 0) {
        onTimeout();
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [lastActivityTime, onTimeout]);
  
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const isWarning = countdown < 60;
  
  return (
    <div css={containerStyle(isWarning)}>
      <div css={labelStyle}>무입력 타이머</div>
      <div css={timerStyle(isWarning)}>{formatCountdown(countdown)}</div>
      {isWarning && (
        <div css={warningStyle}>⚠️ 곧 초기화됩니다!</div>
      )}
    </div>
  );
}

const containerStyle = (isWarning: boolean) => css`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: ${isWarning ? 'rgba(181, 36, 36, 0.1)' : 'var(--surface-container-low)'};
  border: 1px solid ${isWarning ? 'var(--secondary)' : 'var(--text)'};
  transition: all 0.3s ease;
  
  ${isWarning && `
    animation: pulse 1s ease-in-out infinite;
    
    @keyframes pulse {
      0%, 100% { border-color: var(--secondary); }
      50% { border-color: transparent; }
    }
  `}
`;

const labelStyle = css`
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.7;
`;

const timerStyle = (isWarning: boolean) => css`
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: ${isWarning ? 'var(--secondary)' : 'var(--primary)'};
  min-width: 60px;
`;

const warningStyle = css`
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--secondary);
  margin-left: auto;
`;
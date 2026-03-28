/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import { useEffect, useState, useRef } from 'react';
import { useReflectionStore } from '../store';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubmitModal({ isOpen, onClose }: SubmitModalProps) {
  const [showStamp, setShowStamp] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const text = useReflectionStore(state => state.text);
  const score = useReflectionStore(state => state.getSincerityScore());
  const clickCount = useReflectionStore(state => state.clickCount);
  const elapsedTime = useReflectionStore(state => state.getElapsedTime());
  const charCount = useReflectionStore(state => state.getCharacterCount());
  
  // 텍스트를 그리드 형식으로 변환
  const CHARS_PER_LINE = 20;
  const paragraphs = text.split('\n');
  const visualLines: string[] = [];
  
  paragraphs.forEach((paragraph) => {
    if (paragraph.length === 0) {
      visualLines.push('');
    } else {
      for (let i = 0; i < paragraph.length; i += CHARS_PER_LINE) {
        const chunk = paragraph.slice(i, i + CHARS_PER_LINE);
        visualLines.push(chunk);
      }
    }
  });
  
  useEffect(() => {
    if (isOpen) {
      // 모달 열리고 1초 후 도장 애니메이션
      setTimeout(() => {
        setShowStamp(true);
      }, 1000);
    } else {
      setShowStamp(false);
    }
  }, [isOpen]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs}초`;
  };
  
  const handleDownloadImage = async () => {
    if (!contentRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: '#FCF9F0',
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = `반성문_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('이미지 다운로드 실패:', error);
      alert('이미지 다운로드에 실패했습니다.');
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: '#FCF9F0',
        scale: 2
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`반성문_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF 다운로드 실패:', error);
      alert('PDF 다운로드에 실패했습니다.');
    } finally {
      setIsExporting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div css={overlayStyle} onClick={onClose}>
      <div css={modalStyle} onClick={e => e.stopPropagation()}>
        <div css={contentWrapperStyle} ref={contentRef}>
          <div css={headerStyle}>
            <h1 css={titleStyle}>반 성 문</h1>
            <div css={metaStyle}>
              작성 일시: {new Date().toLocaleString('ko-KR')}
            </div>
          </div>
          
          <div css={paperStyle}>
            <div css={gridContainerStyle}>
              {/* 각 시각적 줄을 그리드로 렌더링 */}
              {visualLines.map((line, lineIndex) => {
                const characters = line.split('');
                
                return (
                  <div key={lineIndex} css={lineContainerStyle}>
                    {Array.from({ length: CHARS_PER_LINE }).map((_, charIndex) => (
                      <div key={`${lineIndex}-${charIndex}`} css={gridCellStyle}>
                        <span css={characterStyle}>
                          {characters[charIndex] || ''}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
              
              {/* 최소 8줄 확보 */}
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
            
            {/* 도장 */}
            {showStamp && (
              <div css={stampStyle}>
                <img src="/stamp.png" alt="진정성 인증 도장" css={stampImgStyle} />
              </div>
            )}
          </div>
          
          <div css={footerStyle}>
            <div css={certificationStyle}>
              <div css={certLabelStyle}>진정성 지수</div>
              <div css={certValueStyle}>{score}점</div>
            </div>
            <div css={statsStyle}>
              <span>총 {clickCount}회 클릭</span>
              <span>•</span>
              <span>{formatTime(elapsedTime)} 소요</span>
              <span>•</span>
              <span>{charCount}자 작성</span>
            </div>
          </div>
        </div>
        
        <div css={actionsStyle}>
          <button
            css={actionButtonStyle('primary')}
            onClick={handleDownloadImage}
            disabled={isExporting}
          >
            {isExporting ? '처리 중...' : 'PNG로 저장'}
          </button>
          <button
            css={actionButtonStyle('primary')}
            onClick={handleDownloadPDF}
            disabled={isExporting}
          >
            {isExporting ? '처리 중...' : 'PDF로 저장'}
          </button>
          <button css={actionButtonStyle('secondary')} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const modalStyle = css`
  background: var(--surface-container-low);
  border: 2px solid var(--text);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
`;

const contentWrapperStyle = css`
  background: var(--surface);
  padding: 40px;
`;

const headerStyle = css`
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid var(--text);
`;

const titleStyle = css`
  font-family: 'Noto Serif KR', serif;
  font-size: 48px;
  font-weight: 700;
  letter-spacing: 0.5em;
  color: var(--text);
  margin: 0 0 16px 0;
`;

const metaStyle = css`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: var(--text);
  opacity: 0.6;
`;

const paperStyle = css`
  position: relative;
  background: var(--surface);
  border: 2px solid var(--text);
  min-height: 400px;
  padding: 40px;
  margin-bottom: 32px;
`;

const gridContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const lineContainerStyle = css`
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  gap: 0;
  width: 100%;
`;

const gridCellStyle = css`
  aspect-ratio: 1;
  border: 1px solid rgba(4, 100, 100, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: var(--surface);
  min-width: 32px;
  min-height: 32px;
`;

const characterStyle = css`
  font-family: 'Noto Serif KR', serif;
  font-size: 18px;
  font-weight: 500;
  color: var(--text);
  line-height: 1;
`;

const stampAppear = keyframes`
  0% {
    transform: rotate(-5deg) scale(0);
    opacity: 0;
  }
  50% {
    transform: rotate(-3deg) scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: rotate(-2deg) scale(1);
    opacity: 1;
  }
`;

const stampStyle = css`
  position: absolute;
  bottom: 40px;
  right: 40px;
  width: 120px;
  height: 120px;
  animation: ${stampAppear} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: rotate(-2deg);
  z-index: 10;
`;

const stampImgStyle = css`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const footerStyle = css`
  text-align: center;
  padding-top: 24px;
  border-top: 2px solid var(--text);
`;

const certificationStyle = css`
  margin-bottom: 16px;
`;

const certLabelStyle = css`
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
`;

const certValueStyle = css`
  font-family: 'Inter', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: var(--primary);
`;

const statsStyle = css`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: var(--text);
  opacity: 0.7;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const actionsStyle = css`
  display: flex;
  gap: 12px;
  padding: 24px;
  background: var(--surface-container-low);
  border-top: 2px solid var(--text);
`;

const actionButtonStyle = (variant: 'primary' | 'secondary') => css`
  flex: 1;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  padding: 16px 24px;
  background: ${variant === 'primary' ? 'var(--primary)' : 'var(--secondary)'};
  color: var(--surface);
  border: 2px solid var(--text);
  cursor: pointer;
  transition: all 0.15s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  &:hover:not(:disabled) {
    transform: translate(-2px, -2px);
    box-shadow: 4px 4px 0 var(--text);
  }
  
  &:active:not(:disabled) {
    transform: translate(0, 0);
    box-shadow: 2px 2px 0 var(--text);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

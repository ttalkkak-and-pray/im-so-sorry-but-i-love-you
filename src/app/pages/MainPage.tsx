/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate } from 'react-router';

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div css={containerStyle}>
      {/* 히어로 섹션 */}
      <header css={heroStyle}>
        <div css={heroInnerStyle}>
          <img src="/logo.png" alt="암소쏘리 로고" css={logoImgStyle} />
          <h1 css={titleStyle}>진정성 강제 반성문 작성기</h1>
          <p css={heroSubtitleStyle}>손가락이 아파야 마음이 열립니다.</p>
        </div>
      </header>

      <main css={mainStyle}>
        {/* 경고 섹션 */}
        <section css={sectionStyle}>
          <h2 css={sectionTitleStyle}>
            <span css={sectionTitleBorderStyle} />
            주의 사항
          </h2>
          <div css={warningListStyle}>
            <div css={warningItemStyle}>
              <span css={warningIconStyle}>✕</span>
              <span>물리 키보드는 반성을 방해합니다</span>
            </div>
            <div css={warningItemStyle}>
              <span css={warningIconStyle}>✕</span>
              <span>손가락 하나로 죄값을 치르세요</span>
            </div>
            <div css={warningItemStyle}>
              <span css={warningIconStyle}>✕</span>
              <span>규칙을 어기면 당신의 반성은 무효입니다 (암소가 압니다)</span>
            </div>
          </div>
        </section>

        {/* 사용 방법 섹션 */}
        <section css={sectionStyle}>
          <h2 css={sectionTitleStyle}>
            <span css={sectionTitleBorderStyle} />
            사용 방법
          </h2>
          <div css={stepsStyle}>
            <div css={stepItemStyle}>
              <div css={stepNumberStyle}>1</div>
              <div css={stepContentStyle}>
                <strong>당신의 죄목을 스스로 자백하세요</strong>
                <p>부정해도 소용없습니다. 암소는 이미 알고 있습니다.</p>
              </div>
            </div>
            <div css={stepDividerStyle} />
            <div css={stepItemStyle}>
              <div css={stepNumberStyle}>2</div>
              <div css={stepContentStyle}>
                <strong>화면 키보드로 입력</strong>
                <p>물리 키보드는 차단됩니다. 화면에 표시된 키보드만 사용할 수 있습니다.</p>
              </div>
            </div>
            <div css={stepDividerStyle} />
            <div css={stepItemStyle}>
              <div css={stepNumberStyle}>3</div>
              <div css={stepContentStyle}>
                <strong>눈물은 선택, 반성은 필수</strong>
                <p>자리를 피하면 반성문이 사라집니다. 도망은 허용되지 않습니다.</p>
              </div>
            </div>
            <div css={stepDividerStyle} />
            <div css={stepItemStyle}>
              <div css={stepNumberStyle}>4</div>
              <div css={stepContentStyle}>
                <strong>50자 이상 작성 후 제출</strong>
                <p>완성된 반성문은 이미지 또는 PDF로 저장할 수 있습니다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div css={ctaWrapperStyle}>
          <button css={ctaButtonStyle} onClick={() => navigate('/interrogation')}>
            죄를 인정하고 시작하기
          </button>
          <p css={ctaNoteStyle}>이미 늦었습니다. 시작하세요.</p>
        </div>
      </main>

      <footer css={footerStyle}>
        <p>© 2026 진정성 강제 반성문 작성기 — 진심은 쉽게 쓰여지지 않습니다.</p>
      </footer>
    </div>
  );
}

const containerStyle = css`
  min-height: 100vh;
  background: var(--surface);
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
`;

const heroStyle = css`
  background: var(--primary);
  color: var(--surface);
  padding: 56px 24px 48px;
  border-bottom: 4px solid var(--text);

  @media (max-width: 768px) {
    padding: 40px 16px 36px;
  }
`;

const heroInnerStyle = css`
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const logoImgStyle = css`
  width: 140px;
  height: 140px;
  object-fit: contain;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    margin-bottom: 12px;
  }
`;

const titleStyle = css`
  font-family: 'Noto Serif KR', serif;
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 14px;
  letter-spacing: 0.08em;
  line-height: 1.4;
  color: var(--surface);

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const heroSubtitleStyle = css`
  font-family: 'Noto Serif KR', serif;
  font-size: 15px;
  margin: 0;
  opacity: 0.75;
  letter-spacing: 0.2em;
  color: var(--surface);

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const mainStyle = css`
  flex: 1;
  max-width: 720px;
  margin: 0 auto;
  width: 100%;
  padding: 56px 24px;
  display: flex;
  flex-direction: column;
  gap: 56px;

  @media (max-width: 768px) {
    padding: 40px 16px;
    gap: 40px;
  }
`;

const sectionStyle = css`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const sectionTitleStyle = css`
  font-family: 'Noto Serif KR', serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.25em;
  color: var(--text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0.5;
`;

const sectionTitleBorderStyle = css`
  display: inline-block;
  width: 24px;
  height: 2px;
  background: var(--text);
  opacity: 0.4;
  flex-shrink: 0;
`;

const warningListStyle = css`
  display: flex;
  flex-direction: column;
  border: 2px solid var(--secondary);
`;

const warningItemStyle = css`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 24px;
  font-family: 'Noto Serif KR', serif;
  font-size: 17px;
  font-weight: 500;
  color: var(--text);
  border-bottom: 1px solid var(--secondary);
  background: var(--surface);

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    font-size: 15px;
    padding: 16px 18px;
    gap: 12px;
  }
`;

const warningIconStyle = css`
  font-size: 14px;
  font-weight: 700;
  color: var(--secondary);
  flex-shrink: 0;
  width: 20px;
  text-align: center;
`;

const stepsStyle = css`
  display: flex;
  flex-direction: column;
  border: 2px solid var(--text);
`;

const stepItemStyle = css`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 24px;
  background: var(--surface);

  @media (max-width: 768px) {
    padding: 18px 16px;
    gap: 14px;
  }
`;

const stepDividerStyle = css`
  height: 1px;
  background: var(--surface-container-high);
  margin: 0 24px;

  @media (max-width: 768px) {
    margin: 0 16px;
  }
`;

const stepNumberStyle = css`
  width: 32px;
  height: 32px;
  background: var(--primary);
  color: var(--surface);
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 13px;
  }
`;

const stepContentStyle = css`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 4px;

  strong {
    font-family: 'Noto Serif KR', serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--text);

    @media (max-width: 768px) {
      font-size: 15px;
    }
  }

  p {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: var(--text);
    opacity: 0.65;
    margin: 0;
    line-height: 1.6;

    @media (max-width: 768px) {
      font-size: 13px;
    }
  }
`;

const ctaWrapperStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding-top: 8px;
`;

const ctaButtonStyle = css`
  font-family: 'Noto Serif KR', serif;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: var(--surface);
  background: var(--primary);
  border: 3px solid var(--primary);
  padding: 18px 64px;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;

  &:hover {
    background: var(--text);
    border-color: var(--text);
  }

  &:active {
    opacity: 0.85;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 16px 48px;
    width: 100%;
  }
`;

const ctaNoteStyle = css`
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: var(--text);
  opacity: 0.45;
  margin: 0;
  letter-spacing: 0.05em;
`;

const footerStyle = css`
  text-align: center;
  padding: 24px;
  border-top: 1px solid var(--text);
  background: var(--surface-container-low);

  p {
    margin: 0;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    color: var(--text);
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    padding: 20px 16px;

    p {
      font-size: 10px;
    }
  }
`;

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useReflectionStore } from "../store";
import { ReflectionTextArea } from "../components/ReflectionTextArea";
import { TabbedKeyboard } from "../components/TabbedKeyboard";
import { SincerityScore } from "../components/SincerityScore";
import { IdleTimer } from "../components/IdleTimer";
import { SubmitModal } from "../components/SubmitModal";
import { PeriodModal } from "../components/PeriodModal";
import { ConfirmModal } from "../components/ConfirmModal";
import { ErrorModal } from "../components/ErrorModal";

export default function ConfessionPage() {
  const navigate = useNavigate();
  const crime = useReflectionStore((state) => state.crime);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteAllConfirmOpen, setIsDeleteAllConfirmOpen] = useState(false);
  const [isGiveUpConfirmOpen, setIsGiveUpConfirmOpen] = useState(false);
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const resetAll = useReflectionStore((state) => state.resetAll);
  const deleteAll = useReflectionStore((state) => state.deleteAll);
  const incrementTabSwitch = useReflectionStore(
    (state) => state.incrementTabSwitch,
  );
  const charCount = useReflectionStore((state) => state.getCharacterCount());
  const submit = useReflectionStore((state) => state.submit);

  const handleGiveUp = () => {
    setIsGiveUpConfirmOpen(true);
  };

  const confirmGiveUp = () => {
    resetAll("포기하기 선택");
    navigate("/");
    setIsGiveUpConfirmOpen(false);
  };

  // 물리 키보드 입력 차단
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd 조합키도 차단 (복사, 붙여넣기 등)
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  // 탭 이동 / 화면 비활성화 감지
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        incrementTabSwitch();
        resetAll("다른 탭으로 이동하거나 창을 비활성화함");
        setErrorModal({
          isOpen: true,
          title: "텍스트가 리셋되었어요",
          message: "진정성 있게 집중해서 작성해주세요.",
        });
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "페이지를 떠나면 작성 중인 반성문이 초기화됩니다.";
      return e.returnValue;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [resetAll, incrementTabSwitch]);

  const handleSubmit = () => {
    if (charCount >= 50) {
      submit();
      setIsSubmitModalOpen(true);
    }
  };

  const handleDeleteOne = () => {
    // 삭제 버튼 클릭 - 전체 삭제하고 deleteCount 증가
    deleteAll();
  };

  const confirmDeleteOne = () => {
    deleteAll();
    setIsDeleteConfirmOpen(false);
  };

  const handleDeleteAll = () => {
    // 전체 삭제 버튼 클릭 - 확인 모달 표시
    setIsDeleteAllConfirmOpen(true);
  };

  const confirmDeleteAll = () => {
    deleteAll();
    setIsDeleteAllConfirmOpen(false);
  };

  const handleIdleTimeout = () => {
    resetAll("5분 이상 작성하지 않음 (무입력 상태)");
    setErrorModal({
      isOpen: true,
      title: "텍스트가 리셋되었어요",
      message: "진정성 있게 집중해서 작성해주세요.",
    });
  };

  const dynamicTheme =
    crime && crime.themeColors
      ? css`
          --surface: ${crime.themeColors.bg};
          --primary: ${crime.themeColors.primary};
          --secondary: ${crime.themeColors.stamp};
          --text: ${crime.themeColors.primary};
          --surface-container-low: ${crime.themeColors.grid};
          --border: ${crime.themeColors.primary};
          background-color: var(--surface);
          color: var(--text);
        `
      : css``;

  return (
    <div css={[containerStyle, dynamicTheme]}>
      <header css={headerStyle}>
        <button css={giveUpButtonStyle} onClick={handleGiveUp}>
          ← 포기하기
        </button>
      </header>

      <div css={contentStyle}>
        {/* 왼쪽: 반성문 + 키보드 */}
        <div css={leftColumnStyle}>
          <ReflectionTextArea />
          <TabbedKeyboard
            onPeriodClick={() => setIsPeriodModalOpen(true)}
            onDeleteOne={handleDeleteOne}
            onDeleteAll={handleDeleteAll}
          />
        </div>

        {/* 오른쪽 사이드바: 타이머 + 진정성 점수 + 제출 버튼 */}
        <div css={rightSidebarStyle}>
          <IdleTimer onTimeout={handleIdleTimeout} />
          <SincerityScore />
          <button
            css={submitButtonStyle(charCount >= 50)}
            onClick={handleSubmit}
            disabled={charCount < 50}
          >
            {charCount >= 50 ? "✓ 제출하기" : `제출 불가 (${charCount}/50자)`}
          </button>
        </div>
      </div>

      <footer css={footerStyle}>
        <p>© 2026 진정성 강제 반성문 작성기 - 진심은 쉽게 쓰여지지 않습니다.</p>
      </footer>

      {/* 모달들 */}
      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
      <PeriodModal
        isOpen={isPeriodModalOpen}
        onClose={() => setIsPeriodModalOpen(false)}
      />

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        title="한 글자 삭제"
        message="마지막 글자를 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        variant="warning"
        onConfirm={confirmDeleteOne}
        onCancel={() => setIsDeleteConfirmOpen(false)}
      />

      <ConfirmModal
        isOpen={isDeleteAllConfirmOpen}
        title="⚠️ 전체 삭제 경고"
        message="모든 내용이 초기화됩니다. 정말로 삭제하시겠습니까?"
        confirmText="전체 삭제"
        cancelText="취소"
        variant="danger"
        onConfirm={confirmDeleteAll}
        onCancel={() => setIsDeleteAllConfirmOpen(false)}
      />

      <ConfirmModal
        isOpen={isGiveUpConfirmOpen}
        title="포기하기"
        message="정말 포기하시겠습니까? 작성 중인 모든 내용이 사라집니다."
        confirmText="포기하기"
        cancelText="취소"
        variant="danger"
        onConfirm={confirmGiveUp}
        onCancel={() => setIsGiveUpConfirmOpen(false)}
      />

      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        onClose={() => setErrorModal({ isOpen: false, title: "", message: "" })}
      />
    </div>
  );
}

const containerStyle = css`
  min-height: 100vh;
  background: var(--surface);
  font-family: "Inter", sans-serif;
  display: flex;
  flex-direction: column;
`;

const headerStyle = css`
  background: var(--surface);
  color: var(--text);
  padding: 32px 24px;
  text-align: center;
  border-bottom: 2px solid var(--text);
  position: relative;

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const giveUpButtonStyle = css`
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  padding: 0;

  &:hover {
    opacity: 1;
  }

  @media (max-width: 768px) {
    left: 16px;
    font-size: 12px;
  }
`;

const contentStyle = css`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;
  padding: 24px;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 300px;
    gap: 20px;
    padding: 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }
`;

const leftColumnStyle = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
`;

const rightSidebarStyle = css`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    order: -1;
  }
`;

const footerStyle = css`
  text-align: center;
  padding: 24px;
  border-top: 1px solid var(--text);
  background: var(--surface-container-low);

  p {
    margin: 0;
    font-family: "Inter", sans-serif;
    font-size: 12px;
    color: var(--text);
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    padding: 20px 16px;

    p {
      font-size: 10px;
    }
  }
`;

const submitButtonStyle = (isEnabled: boolean) => css`
  width: 100%;
  font-family: "Inter", sans-serif;
  font-size: 18px;
  font-weight: 700;
  padding: 20px;
  background: ${isEnabled ? "var(--primary)" : "var(--surface-container-low)"};
  color: ${isEnabled ? "var(--surface)" : "var(--text)"};
  border: 3px solid var(--text);
  cursor: ${isEnabled ? "pointer" : "not-allowed"};
  transition: all 0.15s ease;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: ${isEnabled ? 1 : 0.5};

  ${isEnabled &&
  `
    &:hover {
      transform: translate(-3px, -3px);
      box-shadow: 6px 6px 0 var(--text);
    }
    
    &:active {
      transform: translate(0, 0);
      box-shadow: 3px 3px 0 var(--text);
    }
  `}

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 16px;
  }
`;

# im-so-sorry-but-i-love-you (진정성 100% 반성문 봇)
다 거짓말 🎶

<img width=300 src="https://velog.velcdn.com/images/d159123/post/89f30216-fb6f-4105-b6e4-70588590a1a4/image.png"></img>

## 🔨 프로젝트 개요
**"당신은 이미 유죄입니다."**
어떤 대답을 해도 최종적으로 죄목이 확정되고 강제로 반성문을 쓰게 되는 만우절 인터랙티브 웹 애플리케이션입니다.
초기 심문을 통해 닉네임을 입력받고, 질문에 대한 사용자의 대답(예/아니오) 및 누적 거절 횟수(아니오 10회 연속 클릭 시 강제 죄 확정 및 애니메이션 효과)에 따라 재치 있는 범죄가 할당됩니다. 이후 확정된 죄목과 테마에 맞춰 고풍스러운 원고지, 각서, 사직서 등의 양식으로 직접 반성문을 작성할 수 있습니다.

- **핵심 기능**: 인터랙티브 심문 (강제 혐의 부과), 특수 CSS 애니메이션 (Shake 효과), 동적 테마 기반 반응형 작성 페이지, 작성된 반성문의 이미지(PNG) 및 PDF 다운로드 기능

## 💻 기술 스택
- **프론트엔드**: Vite, React (v18), TypeScript
- **상태 관리**: Zustand
- **스타일링**: Emotion (CSS-in-JS), Tailwind CSS (보조)
- **라우팅**: React Router (v7)
- **유틸리티**: `html2canvas`, `jspdf` (이미지 및 문서 변환 기능)

## 📁 디렉토리 구조
```text
im-so-sorry-but-i-love-you/
├── src/
│   ├── app/
│   │   ├── components/         # 모달, 타이머, 진정성 점수, 커스텀 키보드 등 UI 컴포넌트
│   │   ├── pages/
│   │   │   ├── MainPage.tsx          # 시작 페이지
│   │   │   ├── InterrogationPage.tsx # 심문 (죄명 선정) 페이지
│   │   │   └── ConfessionPage.tsx    # 반성문 작성 페이지
│   │   ├── Router.tsx          # 앱 라우트 설정
│   │   ├── store.ts            # Zustand 전역 상태 관리 (텍스트, 타이머, 죄명 연동)
│   │   └── constants.ts        # 한글 자음/모음, 특수문자 등 상수 모음
│   ├── assets/                 # confession.json (질문 툴 및 테마 설정), 오디오 파일 등
│   ├── styles/                 # 글로벌 폰트, 테마(CSS 변수), Tailwind 설정
│   └── main.tsx                # React 엘리먼트 렌더링 시작점
├── logs/                       # 초기 기획 및 프롬프트 로깅 (prompts.md)
└── README.md                   # 프로젝트 개요 명세서
```

## 🚀 실행 방법

### 요구 사항
- `Node.js` v18 이상 권장
- `npm` 패키지 매니저

### 설치 및 로컬 서버 실행
```bash
# 1. 의존성 설치
npm install

# 2. 로컬 개발 서버 실행
npm run dev
```

터미널에 출력된 URL (예: `http://localhost:5173`)로 접속하여 직접 심문을 받아보세요!

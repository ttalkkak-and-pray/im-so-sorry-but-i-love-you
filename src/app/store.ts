import { create } from 'zustand';

interface ReflectionState {
  text: string;
  nickname: string;
  crime: any; // Using any for simplicity or you can type it as { title, description, severity, emoji, theme }

  clickCount: number;
  deleteCount: number;
  tabSwitchCount: number;
  resetCount: number; // 리셋 횟수 추가
  startTime: number;
  lastActivityTime: number;
  isSubmitted: boolean;

  setNickname: (name: string) => void;
  setCrime: (crime: any) => void;
    
  addCharacter: (char: string) => void;
  deleteLastCharacter: () => void;
  deleteAll: () => void;
  resetAll: (reason: string) => void;
  incrementTabSwitch: () => void;
  updateLastActivity: () => void;
  submit: () => void;
  
  // 진정성 점수 계산
  getSincerityScore: () => number;
  getCharacterCount: () => number;
  getElapsedTime: () => number;
}

export const useReflectionStore = create<ReflectionState>((set, get) => ({
  text: '',
  nickname: '',
  crime: null,

  clickCount: 0,
  deleteCount: 0,
  tabSwitchCount: 0,
  resetCount: 0, // 리셋 횟수 초기화
  startTime: Date.now(),
  lastActivityTime: Date.now(),
  isSubmitted: false,

  setNickname: (name) => set({ nickname: name }),
  setCrime: (crime) => set({ crime }),
    
  addCharacter: (char: string) => {
    set(state => ({
      text: state.text + char,
      clickCount: state.clickCount + 1,
      lastActivityTime: Date.now()
    }));
  },
  
  deleteLastCharacter: () => {
    set(state => ({
      text: state.text.slice(0, -1),
      deleteCount: state.deleteCount + 1,
      clickCount: state.clickCount + 1,
      lastActivityTime: Date.now()
    }));
  },
  
  deleteAll: () => {
    set(state => ({
      text: '',
      deleteCount: state.deleteCount + 1,
      clickCount: state.clickCount + 1,
      lastActivityTime: Date.now()
    }));
  },
  
  resetAll: (reason: string) => {
    console.log('리셋 사유:', reason);
    set(state => ({
      text: '',
      // 전체 작성 시간, 클릭 수, 삭제 수는 유지
      // clickCount: 0,
      // deleteCount: 0,
      // tabSwitchCount: 0,
      // startTime: Date.now(),
      lastActivityTime: Date.now(),
      isSubmitted: false,
      resetCount: state.resetCount + 1 // 리셋 횟수 증가
    }));
  },
  
  incrementTabSwitch: () => {
    set(state => ({
      tabSwitchCount: state.tabSwitchCount + 1
    }));
  },
  
  updateLastActivity: () => {
    set({ lastActivityTime: Date.now() });
  },
  
  submit: () => {
    set({ isSubmitted: true });
  },
  
  getSincerityScore: () => {
    const state = get();
    const elapsedMinutes = state.getElapsedTime() / 60;
    const charCount = state.getCharacterCount();
    
    // 기본 점수 계산
    let score = 0;
    score += state.clickCount * 0.5; // 클릭당 0.5점
    score += elapsedMinutes * 1.0; // 분당 1점
    score += charCount * 2; // 글자당 2점
    score += state.deleteCount * 15; // 삭제당 +15점 (진정성 있는 수정)
    
    // 감점
    score -= state.tabSwitchCount * 50; // 탭 이동당 -50점
    score -= state.resetCount * 100; // 리셋당 -100점
    
    return Math.max(0, Math.round(score));
  },
  
  getCharacterCount: () => {
    const state = get();
    // 공백, 줄바꿈 제외한 글자 수
    return state.text.replace(/[\s\n]/g, '').length;
  },
  
  getElapsedTime: () => {
    const state = get();
    return Math.floor((Date.now() - state.startTime) / 1000);
  }
}));
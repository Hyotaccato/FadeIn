// src/styles/theme.ts
import { DefaultTheme } from 'styled-components';

// DefaultTheme 인터페이스는 한 번만 확장하면 됩니다.
// 두 테마가 동일한 구조(colors, spacing, borderRadius 등)를 가진다고 가정합니다.
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      darkGray: string;
      mediumGray?: string; // 옵셔널로 처리하거나, 모든 테마에 존재하도록 정의
      lightGray: string;
      text: string;
      gold?: string; // 옵셔널로 처리하거나, 모든 테마에 존재하도록 정의
    };
    spacing: {
      small: string;
      medium: string;
      large: string;
    };
    borderRadius: string;
  }
}

// 1. Netflix 스타일 테마
export const netflixTheme: DefaultTheme = {
  colors: {
    primary: '#E50914', // 넷플릭스 레드
    secondary: '#B81D24', // 어두운 레드
    background: '#141414', // 거의 검은색 배경
    darkGray: '#222222',
    mediumGray: '#333333', // Netflix 테마에만 있는 경우 옵셔널로
    lightGray: '#808080',
    text: '#FFFFFF',
    gold: '#FFD700', // Netflix 테마에만 있는 경우 옵셔널로
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  borderRadius: '4px',
};

// 2. 일반적인 (기존) 테마
export const theme: DefaultTheme = {
  colors: {
    primary: '#e94560', // 기존 테마의 primary
    secondary: '#0f3460', // 기존 테마의 secondary
    background: '##141414', // 기존 테마의 background
    text: '#e0e0e0', // 기존 테마의 text
    lightGray: '#ccc',
    darkGray: '#333',
    // mediumGray, gold는 이 테마에 없다면 정의하지 않거나, 인터페이스에서 옵셔널로 선언
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  borderRadius: '5px', // 기존 테마의 borderRadius
};
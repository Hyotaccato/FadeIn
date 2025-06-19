import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

export const GlobalStyle = createGlobalStyle`
  ${reset}

  /* 여기에 전역 스타일을 추가합니다 */
  body {
    font-family: 'Monoton', 'Arial', sans-serif; /* Monoton is now preferred */
    background-color: #1a1a2e;
    color: #e0e0e0;
    line-height: 1.6;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }

  #root {
    width: 100%;
    max-width: 800px; /* 적절한 최대 너비 설정 */
    padding: 20px;
    box-sizing: border-box;
  }

  h1, h2, h3, h4, h5, h6 {
    color: #e94560;
  }

  button {
    background-color: #e94560;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #e03050;
    }

    &:disabled {
      background-color: #555;
      cursor: not-allowed;
    }
  }
`;
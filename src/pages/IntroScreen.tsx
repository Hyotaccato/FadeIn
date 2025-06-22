// src/components/IntroScreen.tsx
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const IntroContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d1b69 50%, #11998e 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  color: white;
`;

const MainTitle = styled.h1<{ isVisible: boolean }>`
  font-size: 4rem;
  font-weight: 900;
  margin: 0;
  text-align: center;
  letter-spacing: -2px;
  opacity: ${props => props.isVisible ? 1 : 0};
  animation: ${props => props.isVisible ? fadeInUp : 'none'} 1.5s ease-out;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SubTitle = styled.h2<{ isVisible: boolean }>`
  font-size: 1.5rem;
  font-weight: 400;
  margin: 20px 0 0 0;
  text-align: center;
  opacity: ${props => props.isVisible ? 0.8 : 0};
  animation: ${props => props.isVisible ? fadeInUp : 'none'} 1.5s ease-out 0.5s both;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const WelcomeText = styled.p<{ isVisible: boolean }>`
  font-size: 1.1rem;
  font-weight: 300;
  margin: 30px 0 0 0;
  text-align: center;
  opacity: ${props => props.isVisible ? 0.7 : 0};
  animation: ${props => props.isVisible ? fadeIn : 'none'} 1s ease-out 1s both;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin: 20px 0 0 0;
  }
`;

const LoadingDots = styled.div<{ isVisible: boolean }>`
  display: flex;
  gap: 8px;
  margin-top: 40px;
  opacity: ${props => props.isVisible ? 1 : 0};
  animation: ${props => props.isVisible ? fadeIn : 'none'} 1s ease-out 1.5s both;
`;

const Dot = styled.div<{ delay: number }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.6);
  animation: pulse 1.4s ease-in-out infinite both;
  animation-delay: ${props => props.delay}s;

  @keyframes pulse {
    0%, 80%, 100% {
      transform: scale(0);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

interface IntroScreenProps {
  onComplete?: () => void;
  duration?: number; // 화면이 보여질 시간 (밀리초)
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 직후 애니메이션 시작
    const timer1 = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // 지정된 시간 후 완료 콜백 호출
    const timer2 = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, duration);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete, duration]);

  return (
    <IntroContainer>
      <MainTitle isVisible={isVisible}>
        🎬 Fade In
      </MainTitle>
      <SubTitle isVisible={isVisible}>
        당신의 인생 영화는?
      </SubTitle>
      <WelcomeText isVisible={isVisible}>
        최고의 영화들이 기다리고 있습니다
      </WelcomeText>
      <LoadingDots isVisible={isVisible}>
        <Dot delay={0} />
        <Dot delay={0.2} />
        <Dot delay={0.4} />
      </LoadingDots>
    </IntroContainer>
  );
};

export default IntroScreen;
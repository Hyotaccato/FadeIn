// src/components/LoadingSpinner.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Spinner = styled.div`
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid ${({ theme }) => theme.colors.primary}; /* Blue */
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 1.2s linear infinite;
`;

const LoadingSpinner: React.FC = () => (
  <SpinnerOverlay>
    <Spinner />
  </SpinnerOverlay>
);

export default LoadingSpinner;
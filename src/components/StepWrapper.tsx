import styled, { keyframes } from 'styled-components';

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const StepWrapper = styled.div`
  animation: ${slideInRight} 0.4s ease forwards;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
// src/components/Loader.tsx
import styled, { keyframes } from 'styled-components';

export const Loader = () => <Spinner />;

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  border: 4px solid #e50914;
  border-top: 4px solid transparent;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: ${rotate} 1s linear infinite;
  margin: 2rem auto;
`;

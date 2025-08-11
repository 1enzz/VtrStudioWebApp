// src/components/Alert.tsx
import styled from 'styled-components';

interface AlertProps {
  type: 'success' | 'error' | 'info';
  message: string;
}

export const Alert = ({ type, message }: AlertProps) => {
  return <StyledAlert type={type}>{message}</StyledAlert>;
};

const StyledAlert = styled.div<{ type: string }>`
  background-color: ${({ type }) =>
    type === 'success'
      ? '#0f0'
      : type === 'error'
      ? '#c00'
      : '#444'};
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-weight: bold;
  font-family: 'Rajdhani', sans-serif;
  margin-bottom: 1rem;
  animation: fadein 0.3s ease-in-out;

  @keyframes fadein {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

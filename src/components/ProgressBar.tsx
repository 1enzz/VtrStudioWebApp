// src/components/ProgressBar.tsx
import styled from 'styled-components';

const ProgressWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  height: 10px;
  background-color: ${(props) => props.theme.colors.surface}; // fundo escuro da barra
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 1rem;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.05);
`;

const ProgressFill = styled.div<{ progress: number }>`
  width: ${({ progress }) => progress}%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.primary};
  transition: width 0.4s ease;
  border-radius: 6px 0 0 6px;
`;

interface ProgressBarProps {
  step: number;
  totalSteps: number;
}

export const ProgressBar = ({ step, totalSteps }: ProgressBarProps) => {
  const progress = (step / totalSteps) * 100;

  return (
    <ProgressWrapper>
      <ProgressFill progress={progress} />
    </ProgressWrapper>
  );
};

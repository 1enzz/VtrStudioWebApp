import styled from 'styled-components';
import { CheckCircle } from 'lucide-react';

interface BookingConfirmed {
  onRestart?: () => void;
}

export function BookingConfirmed({ onRestart }: BookingConfirmed) {
  return (
    <Container>
      <IconWrapper>
        <CheckCircle size={72} strokeWidth={1.5} />
      </IconWrapper>
      <Title>Agendamento Confirmado!</Title>
      <Subtitle>
        Obrigado por agendar conosco. Você receberá a confirmação por WhatsApp ou telefone. Estamos ansiosos para atender seu veículo!
      </Subtitle>
      {onRestart && (
        <Button onClick={onRestart}>Fazer novo agendamento</Button>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  min-height: 300px;
  gap: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #e50914; // vermelho da identidade visual
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #444;
  max-width: 400px;
`;

const IconWrapper = styled.div`
  color: #e50914;
`;

const Button = styled.button`
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  border: none;
  background-color: #111;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: #333;
  }
`;

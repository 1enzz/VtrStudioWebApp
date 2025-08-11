import styled from 'styled-components';

type Props = {
  onRestart: () => void;
};

export function BookingCancelled({ onRestart }: Props) {
  return (
    <Container>
      <Title>Reserva Cancelada</Title>
      <Message>Seu agendamento foi cancelado com sucesso.</Message>
      <SubMessage>Você pode iniciar um novo agendamento a qualquer momento.</SubMessage>

      <RestartButton onClick={onRestart}>
        Agendar novamente
      </RestartButton>
    </Container>
  );
}
const Container = styled.div`
  background-color: #111;
  color: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 0 12px rgba(255, 0, 0, 0.4);
  font-family: 'Rajdhani', sans-serif;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: red;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const SubMessage = styled.p`
  font-size: 1rem;
  color: #ccc;
`;

const RestartButton = styled.button`
  margin-top: 2rem;
  padding: 0.9rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  background-color: red;
  color: white;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #c00000;
  }
`;

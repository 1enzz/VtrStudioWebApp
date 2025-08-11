import styled from 'styled-components';
import { CheckCircle } from 'lucide-react'; // ícone opcional, estiloso
// Se quiser usar: npm install lucide-react

const SuccessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background-color: ${(props) => props.theme.colors.secondary};
  border: 2px solid ${(props) => props.theme.colors.primary};
  border-radius: 8px;
  font-family: 'Rajdhani', sans-serif;
  text-align: center;
`;

const Title = styled.h2`
  color: ${(props) => props.theme.colors.primary};
  font-size: 1.75rem;
`;

const Message = styled.p`
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
`;

export const Success = () => (
  <SuccessWrapper>
    <CheckCircle size={48} color="#FF0000" strokeWidth={1.5} />
    <Title>Agendamento Confirmado!</Title>
    <Message>
      Obrigado por agendar com a gente. Seu serviço foi registrado com sucesso.
    </Message>
  </SuccessWrapper>
);
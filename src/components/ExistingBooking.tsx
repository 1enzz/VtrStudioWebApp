import styled from 'styled-components';
import type { BookingDTO } from '../types/BookingDTO';

type Props = {
  booking: BookingDTO;
  onConfirmExisting: () => void;
  onCancelExisting: () => void;
  onEditExisting: () => void;
};

export function ExistingBooking({ booking, onConfirmExisting, onCancelExisting, onEditExisting }: Props) {
    var status;
    if(booking.status == "pending"){
        status = "Pendente"
    }else if(booking.status == "confirmed"){
        status = "Confirmado"
    }else{
        status = "Cancelado"
    }
  return (

    <Container>
      <Title>Você já possui um agendamento!</Title>
      <Info><strong>Nome:</strong> {booking.name}</Info>
      <Info><strong>Telefone:</strong> {booking.phone}</Info>
      <Info><strong>Serviço:</strong> {booking.serviceType}</Info>
      <Info><strong>Data:</strong> {new Date(booking.date).toLocaleDateString('pt-BR')}</Info>
      <Info><strong>Veículo:</strong> {booking.vehicleModel}</Info>
      <Info><strong>Status:</strong> {status}</Info>

      <ButtonGroup>
        <ConfirmButton onClick={onConfirmExisting}>Confirmar Este Agendamento</ConfirmButton>
        {/* <EditButton onClick={onEditExisting}>Alterar Este Agendamento</EditButton> */}
        <CancelButton onClick={onCancelExisting}>Cancelar Este Agendamento</CancelButton>
      </ButtonGroup>
    </Container>
  );
}

const Container = styled.div`
  padding: 2rem;
  background: #111;
  border-radius: 16px;
  box-shadow: 0 0 10px #000;
  color: white;
  font-family: 'Rajdhani', sans-serif;
`;

const Title = styled.h2`
  color: red;
  margin-bottom: 1.5rem;
`;

const Info = styled.p`
  font-size: 1.1rem;
  margin: 0.4rem 0;
`;

const ButtonGroup = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BaseButton = styled.button`
  padding: 0.9rem;
  border-radius: 12px;
  border: none;
  font-weight: bold;
  font-family: 'Rajdhani', sans-serif;
  cursor: pointer;
  transition: background 0.2s ease;
`;

const ConfirmButton = styled(BaseButton)`
  background: #0f0;
  color: #000;

  &:hover {
    background: #0c0;
  }
`;

const EditButton = styled(BaseButton)`
  background: #222;
  color: white;

  &:hover {
    background: #444;
  }
`;

const CancelButton = styled(BaseButton)`
  background: red;
  color: white;

  &:hover {
    background: #c00000;
  }
`;

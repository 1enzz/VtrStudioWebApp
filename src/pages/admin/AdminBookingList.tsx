import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { apiAdmin } from '../../api/axios.ts';
import type { BookingDTO } from '../../types/BookingDTO.ts';
import { Alert } from '../../components/Alert';
import { Loader } from '../../components/Loader';

const Container = styled.div`
  padding: 2rem;
  font-family: 'Rajdhani', sans-serif;
  color: ${(props) => props.theme.colors.text};
`;

const Title = styled.h2`
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 1.5rem;
`;

const BookingCard = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.04);
`;

const Info = styled.p`
  margin: 0.25rem 0;
`;

const ButtonGroup = styled.div`
  margin-top: 0.75rem;
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ color: string }>`
  background-color: ${(props) => props.color};
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-family: 'Rajdhani', sans-serif;

  &:hover {
    opacity: 0.85;
  }
`;

export const AdminBookingList = () => {
  const [bookings, setBookings] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiAdmin.get('/bookings');
      setBookings(response.data);
    } catch (err) {
      setError('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  const confirmBooking = async (id: string) => {
    try {
      setError(null);
      await apiAdmin.put(`/bookings/${id}/confirm`);
      fetchBookings();
    } catch {
      setError('Erro ao confirmar agendamento');
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      setError(null);
      await apiAdmin.put(`/bookings/${id}/cancel`);
      fetchBookings();
    } catch {
      setError('Erro ao cancelar agendamento');
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      setError(null);
      await apiAdmin.delete(`/bookings/${id}`);
      fetchBookings();
    } catch {
      setError('Erro ao excluir agendamento');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <Container>
      <Title>Agendamentos do Mês</Title>

      {error && <Alert type="error" message={error} />}
      {loading ? (
        <Loader />
      ) : (
        bookings.map((booking) => (
          <BookingCard key={booking.id}>
            <Info><strong>Nome:</strong> {booking.name}</Info>
            <Info><strong>Telefone:</strong> {booking.phone}</Info>
            <Info><strong>Data:</strong> {new Date(booking.date).toLocaleDateString('pt-BR')}</Info>
            <Info><strong>Serviço:</strong> {booking.serviceType}</Info>
            <Info><strong>Veículo:</strong> {booking.vehicleModel}</Info>
            <Info><strong>Status:</strong> {booking.status}</Info>

            <ButtonGroup>
              <ActionButton color="#0f0" onClick={() => confirmBooking(booking.id)}>Confirmar</ActionButton>
              <ActionButton color="#c00" onClick={() => cancelBooking(booking.id)}>Cancelar</ActionButton>
              <ActionButton color="#444" onClick={() => deleteBooking(booking.id)}>Excluir</ActionButton>
            </ButtonGroup>
          </BookingCard>
        ))
      )}
    </Container>
  );
};
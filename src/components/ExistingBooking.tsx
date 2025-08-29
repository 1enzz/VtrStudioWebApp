import styled from 'styled-components';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { BookingDTO } from '../types/BookingDTO';

type Props = {
  booking: BookingDTO;
  onConfirmExisting?: () => void | Promise<void>;
  onCancelExisting?: () => void | Promise<void>;
  onEditExisting?: () => void;
  onReserveNew?: () => void;
  loading?: boolean;
};

export function ExistingBooking({
  booking,
  onConfirmExisting,
  onCancelExisting,
  onEditExisting,
  onReserveNew,
  loading = false,
}: Props) {
  const date = booking?.date ? new Date(booking.date) : null;
  const isConfirmed = (booking?.status || '').toLowerCase() === 'confirmed';

  return (
    <Card>
      <Title>Você já possui um agendamento</Title>

      <Grid>
        <Field>
          <Label>Nome</Label>
          <Value>{booking?.name || '-'}</Value>
        </Field>
        <Field>
          <Label>Telefone</Label>
          <Value>{booking?.phone || '-'}</Value>
        </Field>
        <Field>
          <Label>Serviço</Label>
          <Value>{booking?.serviceType || '-'}</Value>
        </Field>
        <Field>
          <Label>Veículo</Label>
          <Value>{booking?.vehicleModel || '-'}</Value>
        </Field>
        <Field>
          <Label>Status</Label>
          <Status $ok={isConfirmed}>{booking?.status || '-'}</Status>
        </Field>
        <Field>
          <Label>Data{date && ` / Horário`}</Label>
          <Value>
            {date
              ? format(date, 'dd/MM/yyyy' + (date.getHours() ? " 'às' HH:mm" : ''), { locale: ptBR })
              : '-'}
          </Value>
        </Field>
      </Grid>

      <Actions>
        {!isConfirmed && onConfirmExisting && (
          <Button onClick={onConfirmExisting} disabled={loading}>
            Confirmar
          </Button>
        )}

        {onCancelExisting && (
          <Button onClick={onCancelExisting} disabled={loading}>
            Cancelar agendamento
          </Button>
        )}

        {onReserveNew && (
          <ButtonPrimary onClick={onReserveNew} disabled={loading}>
            Reservar outro serviço
          </ButtonPrimary>
        )}

        {onEditExisting && (
          <ButtonGhost onClick={onEditExisting} disabled={loading}>
            Editar
          </ButtonGhost>
        )}
      </Actions>
    </Card>
  );
}

const Card = styled.div`
  background: #111;
  color: #fff;
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 0 16px rgba(255,255,255,0.06);
`;

const Title = styled.h3`
  margin: 0 0 1rem 0;
  color: #e50914;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: .75rem 1rem;

  @media (max-width: 520px){
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div``;

const Label = styled.div`
  font-size: .85rem;
  opacity: .7;
`;

const Value = styled.div`
  font-weight: 600;
`;

const Status = styled.div<{ $ok: boolean }>`
  font-weight: 700;
  color: ${({ $ok }) => ($ok ? '#3ddc84' : '#ffd25f')};
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: .6rem;
  margin-top: 1rem;
`;

const ButtonBase = styled.button`
  border: none;
  border-radius: 10px;
  padding: .65rem 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: .2s;
  color: #fff;
`;

const Button = styled(ButtonBase)`
  background: #333;
  &:hover { background: #444; }
`;

const ButtonPrimary = styled(ButtonBase)`
  background: #e50914;
  &:hover { background: #ff0f1c; }
`;

const ButtonGhost = styled(ButtonBase)`
  background: transparent;
  outline: 1px solid #333;
  &:hover { background: #181818; }
`;

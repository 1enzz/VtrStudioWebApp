import { useEffect, useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Select } from '../components/Select';
import styled from 'styled-components';
import { VehicleService } from '../services/VehicleService';
import type { Vehicle } from '../services/VehicleService';
import { ServiceService } from '../services/ServiceService';
import type { Service } from '../services/ServiceService';
import { AvailabilityService } from '../services/AvailabilityService';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { isSameDay, parseISO } from 'date-fns';
import { BookingService } from '../services/BookingService';
import { StepWrapper } from '../components/StepWrapper';
import { ProgressBar } from '../components/ProgressBar';
import { Wrapper } from '../components/Wrapper';
import { Success } from '../components/Success';
import { checkUserBooks } from '../services/UserCheckService';
import type { BookingDTO } from '../types/BookingDTO';
import { ExistingBooking } from '../components/ExistingBooking';
import { BookingCancelled } from '../components/BookingCancelled';
import { BookingConfirmed } from '../components/BookingConfirmed';
import { Header } from '../components/Header';
import { Alert } from '../components/Alert';
import { MaskedInput } from '../components/MaskedInput';

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 320px;
  max-width: 400px;
  width: 100%;
  background-color: #111;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 0 16px rgba(255, 255, 255, 0.05);
  color: #fff;
`;

const BookingSteps = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState('');
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const availableDatesAsDate = dates.map((dateStr) => parseISO(dateStr));
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleSizeClass, setVehicleSizeClass] = useState('');
  const [success, setSuccess] = useState(false);
  const [existingBooking, setExistingBooking] = useState<BookingDTO | null>(null);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (step === 2) {
      VehicleService.getAll().then(setVehicles);
    }
  }, [step]);

  useEffect(() => {
    if (step === 3 && vehicleId) {
      ServiceService.getAvailable(vehicleId).then(setServices);
    }
  }, [step, vehicleId]);

  useEffect(() => {
    if (step === 4 && vehicleId && serviceId) {
      AvailabilityService.getAvailableDates(vehicleId, serviceId).then(setDates);
    }
  }, [step, vehicleId, serviceId]);

  const handleNextStep = async () => {
    setError(null);

    if (step === 1) {
      if (!name || !phone) {
        setError('Preencha seu nome e telefone para continuar.');
        return;
      }

      try {
        const result = await checkUserBooks(phone);
        if (result) {
          setExistingBooking(result);
          setStep(99);
          return;
        }
      } catch (err) {
        console.error('Erro ao verificar agendamento existente:', err);
        setError('Erro ao verificar agendamento.');
        return;
      }
    }
    if (step === 2 && !vehicleId) {
      setError('Selecione um veículo para continuar.');
      return;
    }
    if (step === 3 && !serviceId) {
      setError('Selecione um serviço para continuar.');
      return;
    }

    setStep((prev) => prev + 1);
  };

  return (
    <Wrapper>
      <Header />
      {!success && <ProgressBar step={step} totalSteps={4} />}

      {!success && step === 1 && (
        <Form>
          <StepWrapper>
            {error && <Alert type="error" message={error} />}
            <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} />
            <MaskedInput
              label="Telefone"
              mask="(00) 00000-0000"
              onlyNumbers
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button onClick={handleNextStep}>Próximo</Button>
          </StepWrapper>
        </Form>
      )}

      {!success && step === 2 && (
        <Form>
          <StepWrapper>
            {error && <Alert type="error" message={error} />}
            <Select
              label="Modelo do Veículo"
              value={vehicleId}
              onChange={(value) => setVehicleId(value)}
              options={vehicles.map((v) => ({ value: v.id, label: v.name }))}
              isSearchable={true}
            />
            <Button onClick={handleNextStep}>Próximo</Button>
          </StepWrapper>
        </Form>
      )}

      {!success && step === 3 && (
        <Form>
          <StepWrapper>
            {error && <Alert type="error" message={error} />}
            <Select
              label="Selecione o Serviço"
              value={serviceId}
              onChange={(value) => setServiceId(value)}
              options={services.map((v) => ({ value: v.id, label: v.name }))}
              isSearchable={true}
            />
            <Button onClick={handleNextStep}>Próximo</Button>
          </StepWrapper>
        </Form>
      )}

      {!success && step === 4 && (
        <Form>
          <StepWrapper>
            {error && <Alert type="error" message={error} />}
            <label style={{ fontWeight: 600 }}>Selecione a Data</label>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{ available: availableDatesAsDate }}
              modifiersClassNames={{ available: 'available-day' }}
              disabled={(date) =>
                !availableDatesAsDate.some((availableDate) => isSameDay(date, availableDate))
              }
            />
            <Button
              onClick={async () => {
                setError(null);
                if (!selectedDate) {
                  setError('Selecione uma data.');
                  return;
                }

                const payload = {
                  name,
                  phone,
                  vehicle: {
                    model: vehicleId,
                    sizeClass: 'Pequeno',
                  },
                  serviceType: serviceId,
                  date: selectedDate.toISOString(),
                };

                try {
                  await BookingService.createBooking(payload);
                  setError(null);
                  setSuccess(true);
                } catch (error) {
                  console.error('Erro ao salvar agendamento', error);
                  setError('Erro ao salvar agendamento.');
                }
              }}
            >
              Confirmar Agendamento
            </Button>
          </StepWrapper>
        </Form>
      )}

      {!success && step === 99 && existingBooking && (
        <Form>
          <StepWrapper>
            {error && <Alert type="error" message={error} />}
            <ExistingBooking
              booking={existingBooking}
              onConfirmExisting={async () => {
                try {
                  setError(null);
                  await BookingService.confirmBooking(existingBooking.id);
                  setStep(5);
                } catch (error) {
                  console.error(error);
                  setError('Erro ao confirmar agendamento.');
                }
              }}
              onCancelExisting={async () => {
                try {
                  setError(null);
                  await BookingService.cancelBooking(existingBooking.id);
                  setExistingBooking(null);
                  setCancelled(true);
                } catch (err) {
                  setError('Erro ao cancelar agendamento.');
                }
              }}
              onEditExisting={() => {
                setError('Funcionalidade de edição ainda será implementada.');
              }}
            />
          </StepWrapper>
        </Form>
      )}

      {step === 5 && (
        <BookingConfirmed
          onRestart={() => {
            setStep(1);
            setName('');
            setPhone('');
            setVehicleId('');
            setVehicleModel('');
            setVehicleSizeClass('');
            setServiceId('');
            setSelectedDate(undefined);
            setExistingBooking(null);
            setCancelled(false);
          }}
        />
      )}

      {cancelled && (
        <BookingCancelled
          onRestart={() => {
            setCancelled(false);
            setStep(1);
          }}
        />
      )}

      {success && <Success />}
    </Wrapper>
  );
};

export default BookingSteps;

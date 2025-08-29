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
import { Loader } from '../components/Loader';

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


const Info = styled.div`
  background-color: #1a1a1a;
  border: 1px dashed #e50914;
  color: #fff;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  line-height: 1.35;
  font-size: 0.95rem;
  strong { color: #e50914; }
`;

const BookingSteps = () => {
  const [step, setStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(4); 
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

 
  const [bypassExistingCheck, setBypassExistingCheck] = useState(false);

  const [vehicleId, setVehicleId] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState('');
  const [isHourly, setIsHourly] = useState<boolean | null>(null);

  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const availableDatesAsDate = dates.map((dateStr) => parseISO(dateStr));

  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleSizeClass, setVehicleSizeClass] = useState('');

  const [success, setSuccess] = useState(false);
  const [existingBooking, setExistingBooking] = useState<BookingDTO | null>(null);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const [hours, setHours] = useState<string[]>([]);
  const [selectedHour, setSelectedHour] = useState<string>('');


  useEffect(() => {
    const run = async () => {
      if (step !== 2) return;
      setError(null);
      setLoading(true);
      try {
        const data = await VehicleService.getAll();
        setVehicles(data);
      } catch (e) {
        console.error(e);
        setError('Erro ao carregar veículos.');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [step]);

  // STEP 3: carregar serviços
  useEffect(() => {
    const run = async () => {
      if (step !== 3 || !vehicleId) return;
      setError(null);
      setLoading(true);
      try {
        const data = await ServiceService.getAvailable(vehicleId);
        setServices(data);
      } catch (e) {
        console.error(e);
        setError('Erro ao carregar serviços disponíveis.');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [step, vehicleId]);

  useEffect(() => {
    const run = async () => {
      if (!serviceId) { setIsHourly(null); return; }
      setError(null);
      setLoading(true);
      try {
        const hourly = await ServiceService.isHourly(serviceId);
        setIsHourly(hourly);
      } catch (e) {
        console.error(e);
        setIsHourly(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [serviceId]);

  // STEP 4: carregar datas
  useEffect(() => {
    const run = async () => {
      if (step !== 4 || !vehicleId || !serviceId) return;
      setError(null);
      setLoading(true);
      try {
        const data = await AvailabilityService.getAvailableDates(vehicleId, serviceId);
        setDates(data);
      } catch (e) {
        console.error(e);
        setError('Erro ao carregar datas disponíveis.');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [step, vehicleId, serviceId]);

  const handleNextStep = async () => {
    setError(null);

    if (step === 1) {
      if (!name || !phone) {
        setError('Preencha seu nome e telefone para continuar.');
        return;
      }

      try {
        setLoading(true);
      
        if (!bypassExistingCheck) {
          const result = await checkUserBooks(phone);
          if (result) {
            setExistingBooking(result);
            setStep(99);
            return;
          }
        }
      } catch (err) {
        console.error('Erro ao verificar agendamento existente:', err);
        setError('Erro ao verificar agendamento.');
        return;
      } finally {
        setLoading(false);
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

  const buildPayload = (dateToUse: Date) => ({
    name,
    phone,
    vehicle: {
      model: vehicleId,
      sizeClass: 'Pequeno', 
    },
    serviceType: serviceId,
    date: dateToUse.toISOString(),
  });

  return (
    <Wrapper>
      <Header />
      {!success && <ProgressBar step={step} totalSteps={totalSteps} />}

      {loading && <Loader />}

      {/* PASSO 1 */}
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
            <Button onClick={handleNextStep} disabled={loading}>Próximo</Button>
          </StepWrapper>
        </Form>
      )}

      {/* PASSO 2 */}
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
            <Button onClick={handleNextStep} disabled={loading}>Próximo</Button>
          </StepWrapper>
        </Form>
      )}

      {/* PASSO 3 */}
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
            <Button onClick={handleNextStep} disabled={loading}>Próximo</Button>
          </StepWrapper>
        </Form>
      )}

      {/* PASSO 4 */}
      {!success && step === 4 && (
        <Form>
          <StepWrapper>
            {error && <Alert type="error" message={error} />}

            {isHourly === false && (
              <Info>
                <strong>Atenção:</strong> este serviço ocupa o <strong>dia inteiro</strong>. Ao selecionar a data,
                <br />você <strong>não</strong> poderá escolher um horário específico.
              </Info>
            )}

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
              disabled={loading}
              onClick={async () => {
                setError(null);
                if (!selectedDate) {
                  setError('Selecione uma data.');
                  return;
                }

                try {
                  setLoading(true);

                  const hourly = (isHourly !== null)
                    ? isHourly
                    : await ServiceService.isHourly(serviceId);

                  if (hourly) {
                    const hrs = await AvailabilityService.getAvailableHours(
                      vehicleId,
                      serviceId,
                      selectedDate
                    );

                    if (hrs && hrs.length > 0) {
                      setHours(hrs);
                      setSelectedHour('');
                      setTotalSteps(5);
                      setStep(5);
                      return;
                    }

                    setError('Não há horários disponíveis nesta data. Por favor, escolha outra data.');
                    return;
                  }

                  const payload = buildPayload(selectedDate);
                  await BookingService.createBooking(payload);
                  setSuccess(true);
                } catch (e) {
                  console.error('Erro ao obter horários ou salvar agendamento', e);
                  setError('Erro ao processar sua solicitação.');
                } finally {
                  setLoading(false);
                }
              }}
            >
              Continuar
            </Button>
          </StepWrapper>
        </Form>
      )}

      {/* PASSO 5 — Selecionar Horário */}
      {!success && step === 5 && (
        <Form>
          <StepWrapper>
            {error && <Alert type="error" message={error} />}
            <Select
              label="Selecione o Horário"
              value={selectedHour}
              onChange={(value) => setSelectedHour(value)}
              options={hours.map((h) => ({ value: h, label: h }))}
              isSearchable={false}
            />
            <Button
              disabled={loading}
              onClick={async () => {
                setError(null);
                if (!selectedDate) {
                  setError('A data do agendamento não está definida.');
                  return;
                }
                if (!selectedHour) {
                  setError('Selecione um horário.');
                  return;
                }

                const [hh, mm] = selectedHour.split(':').map(Number);
                const finalDate = new Date(selectedDate);
                finalDate.setHours(hh || 0, mm || 0, 0, 0);

                try {
                  setLoading(true);
                  const payload = buildPayload(finalDate);
                  await BookingService.createBooking(payload);
                  setSuccess(true);
                } catch (e) {
                  console.error('Erro ao salvar agendamento', e);
                  setError('Erro ao salvar agendamento.');
                } finally {
                  setLoading(false);
                }
              }}
            >
              Confirmar Agendamento
            </Button>
          </StepWrapper>
        </Form>
      )}

      {/* PASSO 99 — Agendamento existente */}
      {!success && step === 99 && existingBooking && (
        <Form>
          <StepWrapper>
            {error && <Alert type="error" message={error} />}
            <ExistingBooking
              booking={existingBooking}
              onConfirmExisting={async () => {
                try {
                  setError(null);
                  setLoading(true);
                  await BookingService.confirmBooking(existingBooking.id);
                  setTotalSteps(6);
                  setStep(6);
                } catch (error) {
                  console.error(error);
                  setError('Erro ao confirmar agendamento.');
                } finally {
                  setLoading(false);
                }
              }}
              onCancelExisting={async () => {
                try {
                  setError(null);
                  setLoading(true);
                  await BookingService.cancelBooking(existingBooking.id);
                  setExistingBooking(null);
                  setCancelled(true);
                } catch (err) {
                  setError('Erro ao cancelar agendamento.');
                } finally {
                  setLoading(false);
                }
              }}
              onEditExisting={() => {
                setError('Funcionalidade de edição ainda será implementada.');
              }}
              onReserveNew={() => {
               
                setBypassExistingCheck(true);
                setExistingBooking(null); 
                setStep(2);               
              }}
            />
          </StepWrapper>
        </Form>
      )}

      {/* PASSO 6 — Confirmação */}
      {step === 6 && (
        <BookingConfirmed
          onRestart={() => {
            setStep(1);
            setTotalSteps(4);
            setName('');
            setPhone('');
            setVehicleId('');
            setVehicleModel('');
            setVehicleSizeClass('');
            setServiceId('');
            setSelectedDate(undefined);
            setExistingBooking(null);
            setCancelled(false);
            setHours([]);
            setSelectedHour('');
            setError(null);
            setBypassExistingCheck(false); 
          }}
        />
      )}

      {cancelled && (
        <BookingCancelled
          onRestart={() => {
            setCancelled(false);
            setStep(1);
            setTotalSteps(4);
            setBypassExistingCheck(false); 
          }}
        />
      )}

      {success && <Success />}
    </Wrapper>
  );
};

export default BookingSteps;

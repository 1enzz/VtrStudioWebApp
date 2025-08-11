import { api } from '../api/axios';

export interface BookingPayload {
  name: string;
  phone: string;
  vehicle: {
    model: string;
    sizeClass: string;
  };
  serviceType: string;
  date: string;
}

export const BookingService = {
  async createBooking(payload: BookingPayload): Promise<void> {
    await api.post('/Bookings/criar', payload);
  },
  async cancelBooking(id: string): Promise<void> {
    await api.put('/UserCheck/cancel', JSON.stringify(id), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  async confirmBooking(id: string): Promise<void> {
    await api.put('/UserCheck/confirm', JSON.stringify(id), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};


import { api } from '../api/axios';

export interface AvailableDate {
  date: string;
}

export const AvailabilityService = {
  async getAvailableDates(vehicleId: string, serviceId: string): Promise<string[]> {
    const service = encodeURIComponent(serviceId);
    const vehicle = encodeURIComponent(vehicleId);

    const response = await api.get<string[]>(
      `/DailyAvailability/verifica-disponibilidade?serviceType=${service}&vehicleModel=${vehicle}`
    );
    return response.data;
  },

  async getAvailableHours(vehicleId: string, serviceId: string, date: Date): Promise<string[]> {
    const service = encodeURIComponent(serviceId);
    const vehicle = encodeURIComponent(vehicleId);
    const d = date.toISOString().split('T')[0];

    const response = await api.get<string[]>(
      `/DailyAvailability/horas-disponiveis?serviceType=${service}&vehicleModel=${vehicle}&date=${d}`
    );
    return response.data;
  },
};

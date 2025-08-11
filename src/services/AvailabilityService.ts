import { api } from '../api/axios';

export interface AvailableDate {
  date: string;
}

export const AvailabilityService = {
  async getAvailableDates(vehicleId:string, serviceId: string): Promise<string[]> {
    const response = await api.get<string[]>(
      `/DailyAvailability/verifica-disponibilidade?serviceType=${serviceId}&vehicleModel=${vehicleId}`)

    return response.data;
  },
};


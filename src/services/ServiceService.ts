import { api } from '../api/axios';

export interface Service {
  id: string;
  name: string;
}

export const ServiceService = {
  async getAvailable(vehicleId: string): Promise<Service[]> {
    const response = await api.get<{ availableServices: string[] }>(
      `/AvailableServicesPerVehicle?model=${vehicleId}`
    );

    return response.data.availableServices.map((serviceName) => ({
      id: serviceName,
      name: serviceName,
    }));
  },
};
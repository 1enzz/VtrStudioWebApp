import { api } from '../api/axios';

export interface Service {
  id: string;
  name: string;
}

export const ServiceService = {
  async getAvailable(vehicleId: string): Promise<Service[]> {
    const params = new URLSearchParams({ model: vehicleId });

    const { data } = await api.get<{ availableServices: string[] }>(
      `/AvailableServicesPerVehicle`,
      { params }
    );

    return (data?.availableServices ?? []).map((serviceName) => ({
      id: serviceName,
      name: serviceName,
    }));
  },

  async isHourly(serviceId: string): Promise<boolean> {
    const params = new URLSearchParams({ serviceType: serviceId });
    const { data } = await api.get<{ isHourly: boolean }>(
      `/ServiceRules/is-hourly`,
      { params }
    );
    return !!data?.isHourly;
  },
};

import { api } from '../api/axios';

export interface Vehicle {
  id: string;
  name: string;
}

export const VehicleService = {
  async getAll(): Promise<Vehicle[]> {
    const response = await api.get<string[]>('/Vehicle/buscar-veiculos');
    return response.data.map((vehicleName) => ({
      id: vehicleName, 
      name: vehicleName,
    }));
  },
};
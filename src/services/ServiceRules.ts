import { apiAdmin } from '../api/axios';

export type MaxPerDay = Record<string, number>;

export interface ServiceRule {
  id?: string;
  serviceType: string;
  duration: string;     
  maxPerDay: MaxPerDay;   
}

export const ServiceRulesService = {
  async list(): Promise<ServiceRule[]> {
    const { data } = await apiAdmin.get('/services');
    return data;
  },

  async getById(id: string): Promise<ServiceRule> {
    const { data } = await apiAdmin.get(`/services/${id}`);
    return data;
  },

  async create(payload: ServiceRule): Promise<ServiceRule> {
    const { data } = await apiAdmin.post('/services', payload);
    return data;
  },

  async update(id: string, payload: ServiceRule): Promise<ServiceRule> {
    const { data } = await apiAdmin.put(`/services/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiAdmin.delete(`/services/${id}`);
  },
};

import { apiAdmin } from '../api/axios';

export type CreateUserRequest = {
  username: string;
  password: string;
  role: 'admin' | 'user';
};

export type UpdateUserRequest = {
  password?: string;
  role?: 'admin' | 'user';
};

export type UserOutput = {
  id: string;
  username: string;
  role: 'admin' | 'user';
  createdAt?: string;
};

export const AdminUserService = {
  async createUser(payload: CreateUserRequest): Promise<UserOutput> {
    const { data } = await apiAdmin.post<UserOutput>('/users', payload);
    return data;
  },

  async getUser(username: string): Promise<UserOutput> {
    const { data } = await apiAdmin.get<UserOutput>(`/users/${encodeURIComponent(username)}`);
    return data;
  },

  async updateUser(username: string, payload: UpdateUserRequest): Promise<UserOutput> {
    const { data } = await apiAdmin.put<UserOutput>(`/users/${encodeURIComponent(username)}`, payload);
    return data;
  },

  async deleteUser(username: string): Promise<void> {
    await apiAdmin.delete(`/users/${encodeURIComponent(username)}`);
  },
};

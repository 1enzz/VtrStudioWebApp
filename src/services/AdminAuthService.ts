import { apiAdmin } from '../api/axios'; 

interface LoginPayload {
  username: string;
  password: string;
}

export const AdminAuthService = {
  async login(payload: LoginPayload): Promise<boolean> {
    try {
        const response = await apiAdmin.post('/login', payload);

        const token = response.data.token;

        if (token) {
          localStorage.setItem('adminToken', token);
          return true;
        }
        return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  },

  logout() {
    localStorage.removeItem('adminToken');
    delete apiAdmin.defaults.headers.common['Authorization'];
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('adminToken');
  },

  getToken(): string | null {
    return localStorage.getItem('adminToken');
  }
};

export type UserOutputDTO = {
  id: string;
  username: string;
  role: 'admin' | 'user';
  createdAt?: string;
};

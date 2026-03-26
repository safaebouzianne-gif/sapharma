export interface User {
  id?: number;
  username: string;
  password?: string;
  role: 'ADMIN' | 'EMPLOYE';
  token?: string;
}

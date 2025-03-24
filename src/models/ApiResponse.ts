import type { User } from './User';

export interface LoginApiResponse {
  admin: User;
  token: string;
}

export interface ErrorApiResponse {
  message: string;
  errors: string[];
}

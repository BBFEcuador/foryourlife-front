import type { User } from './User';

export interface LoginApiResponse {
  user: User;
  token: string;
}

export interface ErrorApiResponse {
  message: string;
  errors: string[];
}

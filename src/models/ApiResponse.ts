import type { Admin } from './Admin';

export interface LoginApiResponse {
  admin: Admin;
  token: string;
}

export interface ErrorApiResponse {
  message: string;
  errors: string[];
}
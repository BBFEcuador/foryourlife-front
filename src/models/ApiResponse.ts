import type { CashDrawer } from './CashDrawer';
import type { User } from './User';

export interface LoginApiResponse {
  admin: User;
  token: string;
  cashDrawer: CashDrawer[];
}

export interface ErrorApiResponse {
  message: string;
  errors: string[];
}

export interface PageableApiResponse<T> {
  content: T;
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}
export interface Sort {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}


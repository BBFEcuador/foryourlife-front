import type { Campus } from "./Campus";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  name1: string;
  name2: string;
  lastname1: string;
  lastname2: string;
  phone: string;
  nickname?: string;
  entityMap: EntityMap[];
}

export interface EntityMap {
  id: string;
  entity: string;
}

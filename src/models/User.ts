export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  entityMap: EntityMap[];
}

export interface EntityMap {
  id: string;
  entity: string;
}

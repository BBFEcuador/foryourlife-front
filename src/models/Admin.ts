
export interface Admin {
  id: string
  name: string
  email: string
  password: string
  role: Role
}

export interface Role {
  id: string
  name: string
  type: string
}

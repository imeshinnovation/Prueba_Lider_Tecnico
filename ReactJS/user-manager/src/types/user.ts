export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  createdAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  age?: number;
}
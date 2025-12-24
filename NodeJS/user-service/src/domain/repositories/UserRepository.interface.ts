// src/domain/repositories/UserRepository.interface.ts
import { User } from '../entities/User';
import { UserId } from '../value-objects/UserId';

export interface UserRepository {
  findAll(): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: UserId): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: UserId): Promise<void>;
}
// src/application/use-cases/ListUsersUseCase.ts
import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository.interface';

export class ListUsersUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(): Promise<User[]> {
        return await this.userRepository.findAll();
    }
}
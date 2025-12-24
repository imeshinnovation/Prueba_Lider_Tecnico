// src/application/use-cases/DeleteUserUseCase.ts
import { UserId } from '../../domain/value-objects/UserId';
import { UserRepository } from '../../domain/repositories/UserRepository.interface';

export class DeleteUserUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(id: UserId): Promise<void> {
        await this.userRepository.delete(id);
    }
}
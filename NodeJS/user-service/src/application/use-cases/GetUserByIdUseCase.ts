// src/application/use-cases/GetUserByIdUseCase.ts
import { User } from '../../domain/entities/User';
import { UserId } from '../../domain/value-objects/UserId';
import { UserRepository } from '../../domain/repositories/UserRepository.interface';

export class GetUserByIdUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(id: UserId): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('El usuario no se encontro');
        }
        return user;
    }
}
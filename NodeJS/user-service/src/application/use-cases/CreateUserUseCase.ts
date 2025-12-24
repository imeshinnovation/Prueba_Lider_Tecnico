import { User } from '../../domain/entities/User';
import { UserId } from '../../domain/value-objects/UserId';
import { UserRepository } from '../../domain/repositories/UserRepository.interface';
import { CreateUserDto } from '../dto/CreateUserDto';

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) { }

  async execute(dto: CreateUserDto): Promise<User> {
    // 1. Verificar si el email ya existe
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('Correo electrónico ya registrado');
    }

    // 2. Crear el usuario (la entidad ya normaliza y valida)
    const userId = new UserId(new (await import('mongodb')).ObjectId().toHexString());
    const user = User.create(userId, dto);

    // 3. Persistir
    await this.userRepository.save(user);

    return user;
  }
}
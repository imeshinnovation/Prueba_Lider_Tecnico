import { CreateUserUseCase } from '../../../src/application/use-cases/CreateUserUseCase';
import { UserRepository } from '../../../src/domain/repositories/UserRepository.interface';
import { User } from '../../../src/domain/entities/User';

// Mock simple del repositorio
const mockUserRepository = () => ({
    findByEmail: jest.fn(),
    save: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    deleteById: jest.fn(),
    update: jest.fn(),
});

describe('CreateUserUseCase', () => {
    let useCase: CreateUserUseCase;
    let repository: ReturnType<typeof mockUserRepository>;

    beforeEach(() => {
        repository = mockUserRepository();
        useCase = new CreateUserUseCase(repository as unknown as UserRepository);
    });

    describe('execute', () => {
        it('Debería crear un usuario exitosamente cuando el correo electrónico no está registrado', async () => {
            // Estructura AAA (Arrange, Act, Assert)
            // Given (Arrange)
            const userDto = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            };

            (repository.findByEmail as jest.Mock).mockResolvedValue(null);
            (repository.save as jest.Mock).mockResolvedValue(undefined);

            // When (Act)
            const result = await useCase.execute(userDto);

            // Then (Assert)
            expect(repository.findByEmail).toHaveBeenCalledWith(userDto.email);
            expect(repository.save).toHaveBeenCalled();
            expect(result).toBeInstanceOf(User);
            expect(result.email).toBe(userDto.email);
        });

        it('Debería lanzar "Correo electrónico ya registrado" cuando el correo electrónico ya está registrado', async () => {
            // Given (Arrange)
            const userDto = {
                name: 'Jane Doe',
                email: 'jane@example.com',
                password: 'password123',
            };

            // Simulamos que ya existe un usuario (objeto vacío o mock)
            (repository.findByEmail as jest.Mock).mockResolvedValue({} as User);

            // When / Then (Act / Assert)
            await expect(useCase.execute(userDto)).rejects.toThrow('Correo electrónico ya registrado');
            expect(repository.save).not.toHaveBeenCalled();
        });
    });
});

// src/infrastructure/web/express/controllers/UserController.ts
import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../../../application/use-cases/CreateUserUseCase';
import { ListUsersUseCase } from '../../../../application/use-cases/ListUsersUseCase';
import { DeleteUserUseCase } from '../../../../application/use-cases/DeleteUserUseCase';
import { GetUserByIdUseCase } from '../../../../application/use-cases/GetUserByIdUseCase';
import { UserResponseDto } from '../../../../application/dto/UserResponseDto';
import { UserId } from '../../../../domain/value-objects/UserId';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operaciones sobre usuarios
 */

export class UserController {
    constructor(
        private createUserUseCase: CreateUserUseCase,
        private listUsersUseCase: ListUsersUseCase,
        private deleteUserUseCase: DeleteUserUseCase,
        private getUserByIdUseCase: GetUserByIdUseCase,
    ) { }

    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Listar todos los usuarios
     *     tags: [Users]
     *     responses:
     *       200:
     *         description: Lista de usuarios
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/User'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     */
    async list(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.listUsersUseCase.execute();
            const response: UserResponseDto[] = users.map(user => ({
                id: user.id.value,
                name: user.name,
                email: user.email,
                age: user.age,
                createdAt: user.createdAt,
            }));
            res.json(response);
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Error interno del servidor' });
        }
    }

    /**
     * @swagger
     * /users:
     *   post:
     *     summary: Crear un nuevo usuario
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateUserRequest'
     *     responses:
     *       201:
     *         description: Usuario creado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UserResponseDto'
     *       400:
     *         description: Error de validación
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     */
    async create(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.createUserUseCase.execute(req.body);
            const response: UserResponseDto = {
                id: user.id.value,
                name: user.name,
                email: user.email,
                age: user.age,
                createdAt: user.createdAt,
            };
            res.status(201).json(response);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Obtener un usuario por ID
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Usuario encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UserResponseDto'
     *       404:
     *         description: Usuario no encontrado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     */
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const userId = new UserId(req.params.id);
            const user = await this.getUserByIdUseCase.execute(userId);

            const response: UserResponseDto = {
                id: user.id.value,
                name: user.name,
                email: user.email,
                age: user.age,
                createdAt: user.createdAt,
            };

            res.json(response);
        } catch (error: any) {
            if (error.message === 'El usuario no se encontro') {
                res.status(404).json({ error: 'El usuario no se encontro' });
            } else {
                res.status(400).json({ error: error.message });
            }
        }
    }

    /**
     * @swagger
     * /users/{id}:
     *   delete:
     *     summary: Eliminar un usuario por ID
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Usuario eliminado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       404:
     *         description: Usuario no encontrado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     */
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const userId = new UserId(req.params.id);
            await this.deleteUserUseCase.execute(userId);
            res.json({ message: 'El usuario se elimino correctamente' });
        } catch (error: any) {
            res.status(404).json({ error: error.message || 'El usuario no se encontro' });
        }
    }
}
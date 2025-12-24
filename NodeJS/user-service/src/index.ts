// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { MongoUserRepository } from './infrastructure/persistence/mongodb/MongoUserRepository';
import { CreateUserUseCase } from './application/use-cases/CreateUserUseCase';
import { ListUsersUseCase } from './application/use-cases/ListUsersUseCase';
import { DeleteUserUseCase } from './application/use-cases/DeleteUserUseCase';
import { GetUserByIdUseCase } from './application/use-cases/GetUserByIdUseCase';
import { UserController } from './infrastructure/web/express/controllers/UserController';
import { createUserRouter } from './infrastructure/web/express/routes/UserRoutes';
import { specs } from './docs/openapi';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3800;

app.use(cors());
app.use(express.json());

// Ruta por defecto
app.get('/', (req, res) => res.json({ message: 'Servicio de usuarios con DDD' }));

// Ruta para la documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/health', (req, res) => {
    const healthCheck = {
        status: 'UP',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        checks: {
            database: true,
            memory: process.memoryUsage(),
            cpu: process.cpuUsage()
        }
    };
    
    try {
        res.status(200).json(healthCheck);
    } catch (error) {
        healthCheck.status = 'DOWN';
        res.status(503).json(healthCheck);
    }
});

app.get('/openapi.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
});

async function bootstrap() {
    const db = await connectDB();
    const userRepository = new MongoUserRepository(db);

    const createUserUseCase = new CreateUserUseCase(userRepository);
    const listUsersUseCase = new ListUsersUseCase(userRepository);
    const deleteUserUseCase = new DeleteUserUseCase(userRepository);
    const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);

    const userController = new UserController(
        createUserUseCase,
        listUsersUseCase,
        deleteUserUseCase,
        getUserByIdUseCase
    );

    app.use(createUserRouter(userController));

    app.listen(PORT, () => {
        console.log(`Servicio de usuarios con DDD corriendo en http://localhost:${PORT}`);
    });
}

bootstrap().catch(error => {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
});

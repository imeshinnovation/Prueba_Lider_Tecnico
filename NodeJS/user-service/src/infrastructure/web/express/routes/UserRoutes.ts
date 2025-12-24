// src/infrastructure/web/express/routes/user.routes.ts
import { Router } from 'express';
import { UserController } from '../controllers/UserController';

export const createUserRouter = (controller: UserController): Router => {
    const router = Router();

    router.get('/users', (req, res) => controller.list(req, res));
    router.get('/users/:id', (req, res) => controller.getById(req, res));
    router.post('/users', (req, res) => controller.create(req, res));
    router.delete('/users/:id', (req, res) => controller.delete(req, res));

    return router;
};
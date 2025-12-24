// src/docs/openapi.ts (versión corregida)
import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Servicio de Usuarios con DDD',
            version: '1.0.0',
            description: 'API CRUD para gestión de usuarios con arquitectura Domain-Driven Design',
        },
        servers: [
            {
                url: 'http://localhost:3800',
                description: 'Servidor local',
            },
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: '6753abc123def4567890abcd',
                        },
                        name: {
                            type: 'string',
                            example: 'Ana García',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'ana@example.com',
                        },
                        age: {
                            type: 'integer',
                            nullable: true,
                            minimum: 1,
                            example: 28,
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-12-23T10:00:00.000Z',
                        },
                    },
                },
                CreateUserRequest: {
                    type: 'object',
                    required: ['name', 'email'],
                    properties: {
                        name: {
                            type: 'string',
                            example: 'Juan Pérez',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'juan@example.com',
                        },
                        age: {
                            type: 'integer',
                            minimum: 1,
                            nullable: true,
                            example: 35,
                        },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            example: 'Email already in use',
                        },
                    },
                },
            },
        },
    },
    apis: ['./src/infrastructure/web/express/controllers/*.ts'],
};

export const specs = swaggerJSDoc(options);
// src/domain/entities/User.ts
import { UserId } from '../value-objects/UserId';

export interface UserProps {
    name: string;
    email: string;
    age?: number;
    createdAt?: Date;
}

export class User {
    private constructor(
        private readonly _id: UserId,
        private _name: string,
        private _email: string,
        private _age?: number,
        private _createdAt: Date = new Date(),
    ) { }

    // === MÉTODO PARA CREAR NUEVOS USUARIOS (con validaciones estrictas) ===
    static create(id: UserId, props: UserProps): User {
        if (!props.name?.trim()) throw new Error('El nombre es requerido');
        if (!props.email?.trim()) throw new Error('El correo es requerido');

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(props.email)) {
            throw new Error('Formato de correo inválido');
        }

        // Validación de edad solo en creación
        if (props.age !== undefined) {
            if (!Number.isInteger(props.age)) {
                throw new Error('La edad debe ser un número entero');
            }
            if (props.age <= 0) {
                throw new Error('La edad debe ser un número positivo mayor a 0');
            }
        }

        const normalizedEmail = props.email.trim().toLowerCase();

        return new User(
            id,
            props.name.trim(),
            normalizedEmail,
            props.age,
            props.createdAt || new Date()
        );
    }

    // === MÉTODO PARA RECONSTRUIR DESDE BD (sin validaciones estrictas de negocio) ===
    static reconstruct(id: UserId, props: UserProps): User {
        if (!props.name || !props.email) {
            throw new Error('Los datos corruptos: nombre y correo son requeridos');
        }

        // Solo validaciones básicas de integridad (no reglas de negocio nuevas)
        const normalizedEmail = props.email.trim().toLowerCase();

        return new User(
            id,
            props.name.trim(),
            normalizedEmail,
            // Aceptamos cualquier edad almacenada (incluso inválida según reglas actuales)
            props.age,
            props.createdAt || new Date()
        );
    }

    // Getters (sin cambios)
    get id(): UserId { return this._id; }
    get name(): string { return this._name; }
    get email(): string { return this._email; }
    get age(): number | undefined { return this._age; }
    get createdAt(): Date { return this._createdAt; }

    // Método para actualizar edad (mantiene validación estricta)
    updateAge(newAge: number): void {
        if (!Number.isInteger(newAge)) throw new Error('La edad debe ser un número entero');
        if (newAge <= 0) throw new Error('La edad debe ser un número positivo mayor a 0');
        this._age = newAge;
    }
}
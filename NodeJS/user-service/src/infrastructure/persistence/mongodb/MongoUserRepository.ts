// src/infrastructure/persistence/mongodb/MongoUserRepository.ts (actualizado)
import { Db, Collection, ObjectId } from 'mongodb';
import { User } from '../../../domain/entities/User';
import { UserId } from '../../../domain/value-objects/UserId';
import { UserRepository } from '../../../domain/repositories/UserRepository.interface';

export class MongoUserRepository implements UserRepository {
    private collection: Collection;

    constructor(private db: Db) {
        this.collection = this.db.collection('users');
    }

    async findAll(): Promise<User[]> {
        const docs = await this.collection.find({}).toArray();
        return docs.map(doc =>
            User.reconstruct(new UserId(doc._id.toHexString()), {
                name: doc.name,
                email: doc.email,
                age: doc.age,
                createdAt: doc.createdAt,
            })
        );
    }

    // ← NUEVO: Buscar por ID
    async findById(id: UserId): Promise<User | null> {
        const doc = await this.collection.findOne({ _id: new ObjectId(id.value) });
        if (!doc) return null;

        return User.reconstruct(new UserId(doc._id.toHexString()), {
            name: doc.name,
            email: doc.email,
            age: doc.age,
            createdAt: doc.createdAt,
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        const normalizedEmail = email.trim().toLowerCase();
        const doc = await this.collection.findOne({ email: normalizedEmail });
        if (!doc) return null;

        return User.reconstruct(new UserId(doc._id.toHexString()), {
            name: doc.name,
            email: doc.email,
            age: doc.age,
            createdAt: doc.createdAt,
        });
    }

    async save(user: User): Promise<void> {
        await this.collection.insertOne({
            _id: new ObjectId(user.id.value),
            name: user.name,
            email: user.email,
            age: user.age,
            createdAt: user.createdAt,
        });
    }

    async delete(id: UserId): Promise<void> {
        const result = await this.collection.deleteOne({ _id: new ObjectId(id.value) });
        if (result.deletedCount === 0) {
            throw new Error('El usuario no se encontro');
        }
    }
}
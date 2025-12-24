// src/config/database.ts
import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI no está definido en .env');
}

let db: Db | null = null;

export async function connectDB(): Promise<Db> {
    if (db) return db;

    try {
        const client = new MongoClient(MONGODB_URI as string);
        await client.connect();
        db = client.db();
        await db.collection('users').createIndex({ email: 1 }, { unique: true })
        console.log('Conectado a MongoDB');
        return db;
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        process.exit(1);
    }
}
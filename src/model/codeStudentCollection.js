import { connectDB } from '../lib/db.js';
import dotenv from 'dotenv';

dotenv.config();

let codeStudentCollection;

export async function initcodeStudentCollection() {
    const db = await connectDB();
    const collections = await db.listCollections({ name: 'codestudents' }).toArray();
    if (collections.length === 0) {
        await db.createCollection('codestudents');
    }
    codeStudentCollection = db.collection('codestudents');

    // Crear índice único para evitar códigos y nombres duplicados
    await codeStudentCollection.createIndex({ code: 1 }, { unique: true });
    await codeStudentCollection.createIndex({ name: 1 }, { unique: true });

    // Datos predefinidos
    const predefinedUsers = [
        { code: '2019299', name: 'Juan Sebastian Delgado Parra', },
        { code: '2018259', name: 'Luis Miguel Urbina' },
        { code: '2019529', name: 'Ihovanna Laguado' }
    ];

    // Insertar solo si no existen
    for (const user of predefinedUsers) {
        const exists = await codeStudentCollection.findOne({ name: user.name });
        if (!exists) {
            await codeStudentCollection.insertOne(user);
        }
    }
}

export function getcodeStudentCollection() {
    return codeStudentCollection;
}

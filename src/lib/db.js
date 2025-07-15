import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.DB_URL;

if (!uri) {
	throw new Error('❌ ERROR: La variable DB_URL no está definida en el entorno');
}

const client = new MongoClient(uri);
let db;

export async function connectDB() {
	if (!db) {
		try {
			await client.connect();
			console.log('✅ Conectado a MongoDB');
			db = client.db('mongodbVSCodePlaygroundDB'); // Cambia el nombre si tu base se llama distinto
		} catch (error) {
			console.error('❌ Error al conectar a MongoDB:', error);
			throw error;
		}
	}
	return db;
}

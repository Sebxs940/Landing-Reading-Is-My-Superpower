import { connectDB } from '../lib/db.js';

let usersCollection;

export async function initUsersCollection() {
	const db = await connectDB();
	usersCollection = db.collection('users');

	// Crear índice único para evitar correos duplicados
	await usersCollection.createIndex({ email: 1 }, { unique: true });

	// Datos predefinidos
	const predefinedUsers = [
		{ code: '483926', email: 'gxfppea5lb@comic.com', password: 'Aq729!' },
		{ code: '107354', email: 'vq9t4xbosi@comic.com', password: 'Bt583!' },
        { code: '690218', email: 'ct4vbjdukf@comic.com', password: 'Lx194!' }
	];

	// Insertar solo si no existen
	for (const user of predefinedUsers) {
		const exists = await usersCollection.findOne({ email: user.email });
		if (!exists) {
			await usersCollection.insertOne(user);
		}
	}
}

export function getUsersCollection() {
	return usersCollection;
}

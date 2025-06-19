import express from 'express';
import cors from 'cors';
import { connectDB } from './lib/db.js';
import registerVoteRoute from '../src/routes/voteRoutes.js';
import registerLoginRoute from './routes/loginRoutes.js'; // NUEVO
import { initUsersCollection } from '../model/userCollection.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4321;

async function startServer() {
	const db = await connectDB();

	await initUsersCollection();

	registerVoteRoute(app, db);
	registerLoginRoute(app); // NUEVO

	app.listen(PORT, () => {
		console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
	});
}

startServer();

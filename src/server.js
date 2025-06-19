import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './lib/db.js';
import registerVoteRoute from './routes/voteRoutes.js'; // ← Corrige la ruta si es necesario
import registerLoginRoute from './routes/loginRoutes.js'; // ← Asegúrate de que exista este archivo
import { initUsersCollection } from './model/userCollection.js';

const app = express();
const PORT = process.env.PORT || 4321;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, 'dist');

// 🌐 Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(distPath));

// 🔌 Conecta a la base de datos y configura las rutas
async function startServer() {
	const db = await connectDB();
	await initUsersCollection();

	registerVoteRoute(app, db);
	registerLoginRoute(app); // <-- asegúrate que este archivo existe y funciona

	// Redirección para rutas no API
	app.get('*', (req, res) => {
		res.sendFile(path.join(distPath, 'index.html'));
	});

	app.listen(PORT, () => {
		console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
	});
}

startServer();

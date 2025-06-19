import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './lib/db.js';
import registerVoteRoute from './routes/voteRoutes.js';
import registerLoginRoute from './routes/loginRoutes.js';
import { initUsersCollection } from './model/userCollection.js';

const app = express();
const PORT = process.env.PORT || 4321;

// 🔧 Rutas absolutas con ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, 'dist');

// 🌐 Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(distPath));

// 🔌 Conecta a la base de datos y configura las rutas
async function startServer() {
	try {
		const db = await connectDB();
		await initUsersCollection();

		// ✅ Rutas API
		registerVoteRoute(app, db);
		registerLoginRoute(app);

		// 🧭 Redirección a index.html para rutas no API
		app.get('*', (req, res) => {
			res.sendFile(path.join(distPath, 'index.html'));
		});

		app.listen(PORT, () => {
			console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error('❌ Error al iniciar el servidor:', error);
		process.exit(1); // termina el proceso si falla
	}
}

startServer();

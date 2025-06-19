import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './lib/db.js';
import registerVoteRoute from '../src/routes/voteRoutes.js';
import { initUsersCollection } from './model/userCollection.js';

const app = express();
const PORT = process.env.PORT || 4321;

// 🔧 Esto es necesario para rutas absolutas con ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, 'dist');

// 🌐 Middleware
app.use(cors());
app.use(express.json());

// 🗂️ Sirve los archivos estáticos generados por Astro
app.use(express.static(distPath));

// ✅ Rutas API
app.post('/api/vote', async (req, res) => {
	const { Name, Email, Grade, Comic } = req.body;

	if (!Name || !Email || !Grade || !Comic) {
		return res.status(400).json({ message: 'Missing fields' });
	}

	try {
		const db = await connectDB();
		await initUsersCollection();
		registerVoteRoute(app, db);
		registerLoginRoute(app);
		res.status(200).json({ message: 'Vote received' });
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ message: 'Server error' });
	}
});

// 🧭 Redirección para cualquier ruta que no sea API
app.get('*', (req, res) => {
	res.sendFile(path.join(distPath, 'index.html'));
});

// 🚀 Inicia servidor
app.listen(PORT, () => {
	console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});

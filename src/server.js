import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

import { connectDB } from './lib/db.js';
import registerVoteRoute from './routes/voteRoutes.js';
import registerLoginRoute from './routes/loginRoutes.js';
import { initUsersCollection } from './model/userCollection.js';
import { handler } from '../dist/entry.mjs'; // ✅ el SSR handler generado por Astro

const app = express();
const PORT = process.env.PORT || 4321;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

async function startServer() {
  try {
    const db = await connectDB();
    await initUsersCollection();

    console.log('➡️ Registrando rutas de votación...');
    registerVoteRoute(app, db);

    console.log('➡️ Registrando rutas de login...');
    registerLoginRoute(app, db);

    console.log('➡️ Registrando middleware SSR de Astro...');
    app.use(handler); // ✅ Esto es todo lo necesario

    console.log('🚀 Iniciando servidor...');
    app.listen(PORT, () =>
      console.log(`✅ Servidor escuchando en http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error('❌ Error al iniciar:', error);
    process.exit(1);
  }
}

startServer();

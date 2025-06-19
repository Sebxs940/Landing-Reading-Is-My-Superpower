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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, 'dist');

app.use(cors());
app.use(express.json());
app.use(express.static(distPath));

async function startServer() {
  try {
    const db = await connectDB();
    await initUsersCollection();

    registerVoteRoute(app, db);
    registerLoginRoute(app, db);

    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });

    app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
  } catch (error) {
    console.error('❌ Error al iniciar:', error);
    process.exit(1);
  }
}

startServer();

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initVotesCollection, insertVote, votesCollection } from './model/VoteCollection.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Inicializar la colección y los índices únicos
await initVotesCollection();
await votesCollection.createIndex({ name: 1 }, { unique: true });
await votesCollection.createIndex({ email: 1 }, { unique: true });

app.post('/api/vote', async (req, res) => {
	try {
		const { Name, Email, Grade, Comic } = req.body;

		if (!Name || !Email || !Grade || !Comic) {
			return res.status(400).json({ message: 'Missing fields' });
		}

		await insertVote({
			name: Name,
			email: Email,
			grade: Grade,
			comic: Comic
		});

		res.json({ message: '✅ Vote submitted successfully!' });
	} catch (error) {
		if (error.code === 11000) {
			// Error de índice único duplicado
			return res.status(409).json({ message: 'Name or Email already used' });
		}
		console.error('Error:', error);
		res.status(500).json({ message: error.message || '❌ Error saving vote' });
	}
});

const PORT = process.env.PORT || 4321;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

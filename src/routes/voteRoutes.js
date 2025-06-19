export default function registerVoteRoute(app, db) {
	app.post('/api/vote', async (req, res) => {
		const { Name, Email, Grade, Comic } = req.body;
		if (!Name || !Email || !Grade || !Comic) {
			return res.status(400).json({ message: '❌ Campos incompletos' });
		}

		try {
			// Verifica si ya existe un voto con el mismo name o email
			const existingVote = await db.collection('votes').findOne({
				$or: [{ name: Name }, { email: Email }]
			});
			if (existingVote) {
				return res.status(409).json({ message: '❌ Ya existe un voto con ese nombre o email' });
			}

			await db.collection('votes').insertOne({
				name: Name,
				email: Email,
				grade: Grade,
				comic: Comic,
				timestamp: new Date()
			});
			res.json({ message: '✅ ¡Voto registrado!' });
		} catch (err) {
			console.error('Error al insertar voto:', err);
			res.status(500).json({ message: '❌ Error al guardar el voto' });
		}
	});
}

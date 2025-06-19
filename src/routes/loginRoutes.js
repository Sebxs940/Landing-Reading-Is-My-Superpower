import bcrypt from 'bcrypt';

export default function registerLoginRoute(app, db) {
	app.post('/api/login', async (req, res) => {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: '❌ Campos incompletos' });
		}

		try {
			const user = await db.collection('users').findOne({ email });

			if (!user) {
				return res.status(404).json({ message: '❌ Usuario no encontrado' });
			}

			const passwordMatch = await bcrypt.compare(password, user.password);

			if (!passwordMatch) {
				return res.status(401).json({ message: '❌ Contraseña incorrecta' });
			}

			res.json({ message: '✅ Login exitoso', user: { name: user.name, email: user.email } });
		} catch (err) {
			console.error('Error en login:', err);
			res.status(500).json({ message: '❌ Error al iniciar sesión' });
		}
	});
}

import { initUsersCollection, getUsersCollection } from '../../model/userCollection.js';

let initialized = false;

export async function POST({ request }) {
	if (!initialized) {
		await initUsersCollection();
		initialized = true;
	}

	const { email, password } = await request.json();

	if (!email || !password) {
		return new Response(JSON.stringify({ message: 'Missing credentials' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const users = getUsersCollection();
		const user = await users.findOne({ email });

		if (!user || user.password !== password) {
			return new Response(JSON.stringify({ message: 'Invalid email or password' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		return new Response(JSON.stringify({ message: '✅ Login successful', role: user.role }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error('Login error:', err);
		return new Response(JSON.stringify({ message: '❌ Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

export const prerender = false;
import { connectDB } from '../../lib/db.js';

export const POST = async ({ request }) => {
  let body;

  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ message: '❌ Invalid or empty JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!body?.Name || !body?.Email || !body?.Grade || !body?.Comic) {
    return new Response(JSON.stringify({ message: '❌ Missing fields in vote data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const db = await connectDB();

  // Verifica si ya existe un voto con el mismo name o email
  const existing = await db.collection('votes').findOne({
    $or: [
      { name: body.Name },
      { email: body.Email }
    ]
  });

  if (existing) {
    return new Response(JSON.stringify({ message: '❌ Name or Email already used' }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await db.collection('votes').insertOne({
    name: body.Name,
    email: body.Email,
    grade: body.Grade,
    comic: body.Comic,
    timestamp: new Date(),
  });

  return new Response(JSON.stringify({ message: '✅ Your vote was submitted successfully!' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

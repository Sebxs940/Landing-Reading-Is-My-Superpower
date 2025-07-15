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

  if (!body?.Name || !body?.Code || !body?.Grade || !body?.Comic) {
    return new Response(JSON.stringify({ message: '❌ Missing fields in vote data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

const db = await connectDB();

const student = await db.collection('codestudents').findOne({
  name: body.Name,
  code: body.Code
});

if (!student) {
  return new Response(JSON.stringify({ message: '❌ El nombre no coincide con el código registrado' }), {
    status: 403,
    headers: { 'Content-Type': 'application/json' },
  });
}

  // Verifica si ya existe un voto con el mismo name o email
  const existing = await db.collection('votes').findOne({
    $or: [
      { name: body.Name },
      { code: body.Code }
    ]
  });

  if (existing) {
    return new Response(JSON.stringify({ message: '❌ Name or Code already used' }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await db.collection('votes').insertOne({
    name: body.Name,
    code: body.Code,
    grade: body.Grade,
    comic: body.Comic,
    timestamp: new Date(),
  });

  return new Response(JSON.stringify({ message: '✅ Your vote was submitted successfully!' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

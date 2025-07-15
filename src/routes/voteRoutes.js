import {
  isValidUnusedCode,
  markCodeAsUsed
} from '../model/codeStudentCollection.js';

import {
  insertVote,
  hasVoted
} from '../model/voteCollection.js';

export default function registerVoteRoute(app) {
  app.post('/api/vote', async (req, res) => {
    const { Name, Code, Grade, Comic } = req.body;

    if (!Name || !Code || !Grade || !Comic) {
      return res.status(400).json({ message: '❌ Campos incompletos' });
    }

  try {
      // ✅ Verificar que el nombre y código coinciden con un estudiante
      const usersCol = getUsersCollection();
      const userMatch = await usersCol.findOne({ name: Name, code: Code });

      if (!userMatch) {
        return res.status(403).json({ message: '❌ El nombre no coincide con el código registrado' });
      }

      try {
        // ✅ Validar que el código existe y NO ha sido usado
        const validCode = await isValidUnusedCode(Code);
        if (!validCode) {
          return res.status(403).json({ message: '❌ Código inválido o ya usado' });
        }

        // ✅ Evitar duplicados por nombre o código
        const alreadyVoted = await hasVoted({ name: Name, code: Code });
        if (alreadyVoted) {
          return res.status(409).json({ message: '❌ Ya existe un voto con ese nombre o código' });
        }

        // ✅ Insertar el voto
        await insertVote({ name: Name, code: Code, grade: Grade, comic: Comic });

        // ✅ Marcar el código como usado
        await markCodeAsUsed(Code);

        res.json({ message: '✅ ¡Voto registrado!' });

      } catch (err) {
        console.error('❌ Error en /api/vote:', err);
        res.status(500).json({ message: '❌ Error interno del servidor' });
      }
    } catch (err) {
      console.error('❌ Error en /api/vote (outer try):', err);
      res.status(500).json({ message: '❌ Error interno del servidor' });
    }
  });
}

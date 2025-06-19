import { connectDB } from '../lib/db.js';

let votesCollection;

export async function initVotesCollection() {
  const db = await connectDB();
  votesCollection = db.collection('votes');
  await votesCollection.createIndex({ name: 1 }, { unique: true });
  await votesCollection.createIndex({ email: 1 }, { unique: true });
}

export async function insertVote(voteData) {
  if (!votesCollection) await initVotesCollection();
  await votesCollection.insertOne({ ...voteData, timestamp: new Date() });
}

export { votesCollection };

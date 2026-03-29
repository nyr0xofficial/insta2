const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }

  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Champs manquants.' });
  }
  if (message.length < 20) {
    return res.status(400).json({ error: 'Message trop court.' });
  }

  // Sauvegarde dans Redis avec un ID unique basé sur le timestamp
  const id = `contact:${Date.now()}`;
  await redis.hset(id, {
    name,
    email,
    subject,
    message,
    date: new Date().toISOString(),
  });

  console.log(`Nouveau message de contact sauvegardé : ${id}`);
  return res.status(200).json({ message: 'Message reçu, merci !' });
};

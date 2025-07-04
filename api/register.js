import db from './db.js';
import bcrypt from 'bcrypt';
import { generateToken, signCookie } from './utils/crypto.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }

  const { Email, Login, Password } = req.body;

  if (!Email || !Login || !Password) {
    return res.status(400).json({ success: false, message: 'Champs manquants' });
  }

  db.query(
    'SELECT * FROM joke_accounts WHERE Email = ? OR Login = ?',
    [Email, Login],
    async (err, results) => {
      if (err) {
        console.error('❌ Erreur MySQL SELECT :', err);
        return res.status(500).json({ success: false, message: 'Erreur serveur (select)' });
      }

      if (results.length > 0) {
        return res.status(400).json({ success: false, message: 'Email ou login déjà utilisé' });
      }

      const hash = await bcrypt.hash(Password, 10);

      const newAccount = {
        Email,
        Login,
        PasswordHash: hash,
        Ogrine: 0,
        CreationDate: new Date()
      };

      db.query('INSERT INTO joke_accounts SET ?', newAccount, (err, result) => {
        if (err) {
          console.error('❌ Erreur MySQL INSERT :', err);
          return res.status(500).json({ success: false, message: 'Erreur serveur (insert)' });
        }

        const token = generateToken();
        const cookieValue = signCookie(result.insertId, token);

        res.setHeader('Set-Cookie', `rememberme=${cookieValue}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}`);

        res.status(201).json({ success: true, message: '✅ Compte créé avec succès' });
      });
    }
  );
}

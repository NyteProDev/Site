import mysql from 'mysql2/promise'; // ✅ utilise mysql2/promise
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

  try {
    // ✅ Crée une connexion MySQL temporaire (Serverless friendly)
    const connection = await mysql.createConnection({
      host: '185.91.69.200',
      user: 'Nyte2',
      password: 'occelaris40600',
      database: 'site',
    });

    const [rows] = await connection.execute(
      'SELECT * FROM joke_accounts WHERE Email = ?',
      [Email]
    );

    await connection.end(); // ✅ ferme proprement la connexion

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(Password, user.PasswordHash);

    if (!match) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }

    const token = generateToken();
    const cookieValue = signCookie(user.Id, token);

    // ✅ Set cookie
    res.setHeader(
      'Set-Cookie',
      `rememberme=${cookieValue}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}`
    );

    res.json({ success: true, message: 'Connexion réussie' });
  } catch (error) {
    console.error('Erreur API login:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

import db from './db.js';
import { verifyCookie } from './utils/crypto.js';

export default function handler(req, res) {
  const cookie = req.cookies?.rememberme;
  const user = verifyCookie(cookie);
  if (!user) return res.json({ success: false });

  db.query('SELECT Id, Login, Email, Ogrine FROM joke_accounts WHERE Id = ?', [user.uid], (err, results) => {
    if (err || results.length === 0) return res.json({ success: false });
    res.json({ success: true, user: results[0] });
  });
}

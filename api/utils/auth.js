import { verifyCookie } from './crypto.js';

export function authMiddleware(req, res) {
  const cookie = req.cookies?.rememberme;
  const user = verifyCookie(cookie);
  if (!user) {
    res.status(401).json({ success: false, message: 'Non authentifié' });
    return null;
  }
  return user.uid;
}

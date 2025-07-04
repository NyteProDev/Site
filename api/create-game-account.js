// 🔐 Middleware pour vérifier authentification
function authMiddleware(req, res, next) {
  const cookie = req.cookies.rememberme;
  if (!cookie) return res.status(401).json({ success: false, message: 'Non authentifié' });

  const [uid, token, mac] = cookie.split(':');
  const checkMac = crypto.createHmac('sha256', 'secret').update(`${uid}:${token}`).digest('hex');

  if (checkMac !== mac) {
    return res.status(401).json({ success: false, message: 'Cookie invalide' });
  }

  req.userId = uid; // ✅ Injecte l'ID utilisateur
  next();
}
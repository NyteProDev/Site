export default function handler(req, res) {
  res.setHeader('Set-Cookie', `rememberme=; HttpOnly; Path=/; Max-Age=0`);
  res.json({ success: true, message: 'Déconnecté' });
}

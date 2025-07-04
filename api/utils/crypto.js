import crypto from 'crypto';

export function generateToken() {
  return crypto.randomBytes(256).toString('hex');
}

export function signCookie(uid, token) {
  const mac = crypto.createHmac('sha256', 'secret').update(`${uid}:${token}`).digest('hex');
  return `${uid}:${token}:${mac}`;
}

export function verifyCookie(cookie) {
  if (!cookie) return false;

  const [uid, token, mac] = cookie.split(':');
  const checkMac = crypto.createHmac('sha256', 'secret').update(`${uid}:${token}`).digest('hex');

  if (checkMac !== mac) return false;

  return { uid, token };
}

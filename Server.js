import express from 'express';
import mysql from 'mysql';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // gérer cookies
import crypto from 'crypto'; // pour token

const app = express();
const port = 5000; // API sur port 5000

// 🌐 Middlewares globaux
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// ⚙️ Connexion à la base MySQL
const db = mysql.createConnection({
  host: '185.91.69.200',
  user: 'nyte',
  password: 'occelaris40600@',
  database: 'site'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Connecté à MySQL');
});

// 🔥 Génère un token sécurisé
function generateToken() {
  return crypto.randomBytes(256).toString('hex');
}

// 🔥 Stocke le token en base
function storeToken(uid, token, callback) {
  db.query('INSERT INTO tokens (uid, token) VALUES (?, ?)', [uid, token], callback);
}

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

// 🔐 Route d'inscription
app.post('/api/register', async (req, res) => {
  const { Email, Login, Password } = req.body;

  if (!Email || !Login || !Password) {
    return res.status(400).json({ success: false, message: 'Champs manquants' });
  }

  // Vérifier doublons Email / Login
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

      // 🔒 Hash du mot de passe
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
        const userId = result.insertId;
        storeToken(userId, token, (err) => {
          if (err) {
            console.error('❌ Erreur MySQL token :', err);
            return res.status(500).json({ success: false, message: 'Erreur serveur (token)' });
          }

          const cookieValue = `${userId}:${token}`;
          const mac = crypto.createHmac('sha256', 'secret').update(cookieValue).digest('hex');
          const finalCookie = `${cookieValue}:${mac}`;
          res.cookie('rememberme', finalCookie, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });

          res.status(201).json({ success: true, message: 'Compte créé et connecté' });
        });
      });
    }
  );
});

// 🔑 Login
app.post('/api/login', (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res.status(400).json({ success: false, message: 'Champs manquants' });
  }

  db.query(
    'SELECT * FROM joke_accounts WHERE Email = ?',
    [Email],
    async (err, results) => {
      if (err) return res.status(500).json({ success: false, message: 'Erreur serveur' });

      if (results.length === 0) {
        return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
      }

      const user = results[0];
      const match = await bcrypt.compare(Password, user.PasswordHash);

      if (!match) {
        return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
      }

      const token = generateToken();
      storeToken(user.Id, token, (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Erreur token' });

        const cookieValue = `${user.Id}:${token}`;
        const mac = crypto.createHmac('sha256', 'secret').update(cookieValue).digest('hex');
        const finalCookie = `${cookieValue}:${mac}`;
        res.cookie('rememberme', finalCookie, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });

        return res.json({ success: true, message: 'Connexion réussie' });
      });
    }
  );
});

// 📥 Récupérer infos utilisateur
app.get('/api/account', (req, res) => {
  const cookie = req.cookies.rememberme;
  if (!cookie) return res.json({ success: false });

  const [uid, token, mac] = cookie.split(':');
  const checkMac = crypto.createHmac('sha256', 'secret').update(`${uid}:${token}`).digest('hex');

  if (checkMac !== mac) return res.json({ success: false });

  db.query('SELECT Id, Login, Email, Ogrine FROM joke_accounts WHERE Id = ?', [uid], (err, results) => {
    if (err || results.length === 0) return res.json({ success: false });
    res.json({ success: true, user: results[0] });
  });
});

// 🚪 Logout
app.post('/api/logout', (req, res) => {
  res.clearCookie('rememberme');
  res.json({ success: true, message: 'Déconnecté' });
});

// 🎮 Créer compte jeu (avec authMiddleware et limite)
app.post('/api/create-game-account', authMiddleware, (req, res) => {
  const { Login, Nickname, Password } = req.body;
  const userId = req.userId;

  if (!Login || !Nickname || !Password) {
    return res.status(400).json({ success: false, message: 'Tous les champs sont obligatoires.' });
  }

  if (!/^[A-Za-z0-9]{4,30}$/.test(Login) || !/^[A-Za-z0-9]{4,30}$/.test(Nickname)) {
    return res.status(400).json({
      success: false,
      message: 'Login et pseudo doivent contenir 4-30 caractères alphanumériques.'
    });
  }

  // 🔥 Limite de 1 compte jeu
  db.query('SELECT COUNT(*) AS count FROM accounts WHERE OwnerAccountId = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Erreur serveur (compte).' });

    const accountCount = results[0].count;
    const maxAccounts = 1;

    if (accountCount >= maxAccounts) {
      return res.status(400).json({ success: false, message: 'Tu as atteint la limite de comptes jeu.' });
    }

    // Vérifier doublons Login/Nickname
    db.query('SELECT * FROM accounts WHERE Login = ? OR Nickname = ?', [Login, Nickname], (err, results) => {
      if (err) return res.status(500).json({ success: false, message: 'Erreur serveur (doublon).' });

      if (results.length > 0) {
        return res.status(400).json({ success: false, message: 'Login ou pseudo déjà utilisé.' });
      }

      const hashedPassword = crypto.createHash('md5').update(Password).digest('hex');

      db.query('SELECT Vip FROM joke_accounts WHERE Id = ?', [userId], (err, userResults) => {
        if (err) return res.status(500).json({ success: false, message: 'Erreur serveur (VIP).' });

        const role = userResults[0].Vip === 1 ? 2 : 1;

        const newGameAccount = {
          Login,
          Nickname,
          PasswordHash: hashedPassword,
          OwnerAccountId: userId,
          SecretQuestion: 'dummy?',
          SecretAnswer: 'dummy!',
          vip: role,
          CreationDate: new Date()
        };

        db.query('INSERT INTO accounts SET ?', newGameAccount, (err) => {
          if (err) return res.status(500).json({ success: false, message: 'Erreur création compte jeu.' });
          return res.json({ success: true, message: '🎉 Compte jeu créé avec succès !' });
        });
      });
    });
  });
});

// 🧮 Compter comptes jeu liés
app.get('/api/game-accounts-count', authMiddleware, (req, res) => {
  const userId = req.userId;

  db.query('SELECT COUNT(*) AS count FROM accounts WHERE OwnerAccountId = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Erreur serveur.' });
    const count = results[0].count;
    res.json({ success: true, count });
  });
});

// 🚀 Lancer serveur
app.listen(port, () => {
  console.log(`✅ API démarrée sur http://localhost:${port}`);
});

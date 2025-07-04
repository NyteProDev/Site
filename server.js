
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 5000;

// Middlewares
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Support ESM __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger toutes les routes de /api
import login from './api/login.js';
app.post('/api/login', login);

// TODO: Ajouter les autres endpoints si nécessaire

app.listen(port, () => {
  console.log(`✅ API démarrée sur http://localhost:${port}`);
});

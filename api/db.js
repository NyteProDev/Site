import mysql from 'mysql';

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'site',
  connectionLimit: 10
});

export default db;
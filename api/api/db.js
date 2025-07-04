import mysql from 'mysql';

const db = mysql.createPool({
  host: '185.91.69.200',
  user: 'nyte',
  password: 'occelaris40600@',
  database: 'site',
  connectionLimit: 10
});

export default db;
import mysql from 'mysql2/promise';
import config from 'config';

const { host, user, password, database } = config.database;
const pool = mysql.createPool({
  host,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export { pool };

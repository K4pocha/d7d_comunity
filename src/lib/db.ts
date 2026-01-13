import mysql from 'mysql2/promise';

// Si no estás usando Next.js nativo para cargar envs, a veces ayuda:
// import dotenv from 'dotenv';
// dotenv.config(); 

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
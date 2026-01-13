import mysql from 'mysql2/promise';

// Creamos un "pool" (grupo de conexiones) para que sea eficiente
export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',         // Usuario por defecto de XAMPP
  password: '',         // Contraseña vacía por defecto de XAMPP
  database: 'd7d_local', // Tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
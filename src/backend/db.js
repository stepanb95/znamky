const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // Uživatelské jméno pro MySQL
  password: '',        // Heslo pro MySQL
  database: 'skola',   // Název databáze
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error('Chyba při připojení k databázi:', err);
  } else {
    console.log('Připojeno k MySQL databázi.');
  }
});

module.exports = connection;

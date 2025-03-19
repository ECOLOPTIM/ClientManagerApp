const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Calea către baza de date SQLite (poate fi un fișier local)
const dbPath = path.resolve(__dirname, 'database.sqlite');

// Creează și deschide o conexiune la baza de date
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Eroare la conectarea la baza de date:', err.message);
  } else {
    console.log('Conectat la baza de date SQLite.');
  }
});

module.exports = db;
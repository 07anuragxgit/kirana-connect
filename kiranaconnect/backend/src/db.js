const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

let dbPromise;

async function getDb() {
  if (!dbPromise) {
    dbPromise = open({
      filename: path.join(__dirname, '..', 'data_v2.sqlite'),
      driver: sqlite3.Database
    });
  }
  const db = await dbPromise;
  await initDb(db);
  return db;
}

async function initDb(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT,
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS stores (
      id TEXT PRIMARY KEY,
      vendorId TEXT UNIQUE,
      name TEXT,
      owner TEXT,
      distance TEXT,
      rating REAL,
      deliveryTime TEXT,
      address TEXT,
      lat REAL,
      lng REAL,
      tags TEXT,
      open BOOLEAN,
      FOREIGN KEY (vendorId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      storeId TEXT,
      name TEXT,
      price REAL,
      category TEXT,
      image TEXT,
      stock INTEGER,
      FOREIGN KEY (storeId) REFERENCES stores(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      storeId TEXT,
      userId TEXT,
      customerName TEXT,
      customerPhone TEXT,
      total REAL,
      status TEXT,
      createdAt TEXT,
      items TEXT,
      FOREIGN KEY (storeId) REFERENCES stores(id),
      FOREIGN KEY (userId) REFERENCES users(id)
    );
  `);
}

module.exports = { getDb };

// config/db.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
let client = null;
let dbInstance = null;

async function connectDB() {
  if (dbInstance) return dbInstance;

  if (!uri) {
    console.error('❌ MONGO_URI não está definida nas variáveis de ambiente.');
    process.exit(1);
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    dbInstance = client.db();
    console.log('✅ Conectado ao MongoDB Atlas - AzoresScorepap');
    return dbInstance;
  } catch (err) {
    console.error('❌ Falha ao conectar ao MongoDB Atlas:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
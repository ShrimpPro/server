const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url);
const dbName = 'ShrimpPro';
let db;

async function mongoConnect() {
  try {
    await client.connect();
    console.log('Connected successfully to server');
    db = client.db(dbName);
    return 'done.';
  } catch (error) {
    await client.close()
  }
}

const getDatabase = () => db;

module.exports = { mongoConnect, getDatabase };
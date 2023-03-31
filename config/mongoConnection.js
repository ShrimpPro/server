const mongoose = require('mongoose');
const dbName = 'shrimp_pro';
const url = process.env.NODE_ENV === 'test'
  ? process.env.MONGO_TEST
  : process.env.MONGO_SECRET_KEY;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, dbName: dbName });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected successfully to server with Mongoose');
});

module.exports = db;
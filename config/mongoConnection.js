const mongoose = require('mongoose');
const url = process.env.MONGO_SECRET_KEY;
const dbName = 'shrimp_pro';

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, dbName: dbName });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected successfully to server with Mongoose');
});

module.exports = db;
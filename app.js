if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const { mongoConnect } = require('./config/mongoConnection');
const port = process.env.PORT || 4000;
const router = require('./routers');

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(router);

mongoConnect()
  .then(() => app.listen(port, () => console.log('Connected to ' + port)))
  .catch(err => console.log(err)); 
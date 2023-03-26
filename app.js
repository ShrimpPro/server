const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`ShrimpPro listening on port ${port}`)
})
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json( 'Powerball API is running' );
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
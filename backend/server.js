const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Server is working!');
});
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
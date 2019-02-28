const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const students = require('./data/students');
const houses = require('./data/houses');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/students', (req, res) => res.json(students));

app.get('/houses', (req, res) => res.json(houses));

app.listen(5000, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Server started on port 5000');
  }
});

const express = require('express');
const bodyParser = require('body-parser');

const students = require('./data/students');
const houses = require('./data/houses');

const app = express();

app.use(bodyParser.json());

app.get('/students', (req, res) => res.json(students));

app.get('/houses', (req, res) => res.json(houses));

app.post('/students', (req, res) => {
  const student = {
    ...req.body,
    id: students.length + 1,
    house: Math.round(Math.random() * 3) + 1,
  };
  students.push(student);
  res.json(student);
});

app.listen(5000, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Server started on port 5000');
  }
});

const express = require('express');

const students = require('./data/students');
const houses = require('./data/houses');

const app = express();

app.get('/students', (req, res) => res.json(students));

app.get('/houses', (req, res) => res.json(houses));

app.listen(3000);

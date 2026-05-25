const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.use('/api', require('./routes/api'));

module.exports = app;

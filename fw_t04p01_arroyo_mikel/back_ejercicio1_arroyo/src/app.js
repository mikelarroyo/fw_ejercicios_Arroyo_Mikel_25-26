const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: ['http://localhost:4200', 'https://6a17303f90c2d28421d89554--eloquent-cuchufli-7e98e2.netlify.app'] }));
app.use(express.json());

app.use('/api', require('./routes/api'));

module.exports = app;

const express = require('express');
const cors = require('cors');

//express() devuelve una aplicación HTTP.
const app = express();

// Middleware CORS
app.use(cors());

// Middleware para parsear JSON
app.use(cors({ origin: 'http://localhost:4200' }));

module.exports = app;


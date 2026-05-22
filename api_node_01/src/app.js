const express = require("express");
const cors = require("cors");

//express() devuelve una aplicación HTTP.
const app = express();

// Middleware CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

app.use('/api', require('./routes/api'));


module.exports = app;

/* app.get("/api", (req, res) => {
    res.status(200).json({
        message: "API funcionando correctamente",
    });
}); */

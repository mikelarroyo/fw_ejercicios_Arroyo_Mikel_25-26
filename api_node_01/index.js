require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 3000;

// Conectar primero a la base de datos
connectDB().then(() => {
    // Solo arrancamos el servidor si la BD conecta
    app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en puerto ${PORT}`);
    });
});

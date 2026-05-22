const router = require("express").Router();

// Delegamos en places.js
router.use("/places", require("./api/places"));

//Delegamos a products.js
router.use("/products", require("./api/products"));
router.use("/users", require("./api/users"));
router.use("/auth", require("./api/auth"));


module.exports = router;

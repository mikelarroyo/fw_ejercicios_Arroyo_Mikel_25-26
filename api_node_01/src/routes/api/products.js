const router = require("express").Router();

const productsController = require("../../controllers/products.controller");

const { createProductRules, validate } = 
                               require("../../validators/product.validator");

const { checkToken } = require("../../middlewares/auth.middleware");

// Públicas: Se quedan igual
router.get("/", productsController.getAllProducts);
router.get("/search", productsController.searchProducts);
router.get("/:id", productsController.getProductById);

// Privadas (requieren JWT)
router.post("/", checkToken, createProductRules, validate, productsController.createProduct);
router.put("/:id", checkToken, productsController.updateProduct);
router.delete("/:id", checkToken, productsController.deleteProduct);

module.exports = router;

const { body, validationResult } = require('express-validator');
 
// Reglas para crear un producto
const createProductRules = [
  body('name')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('Entre 2 y 100 caracteres'),
 
  body('price')
    .notEmpty().withMessage('El precio es obligatorio')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
 
  body('stock')
    .notEmpty().withMessage('El stock es obligatorio')
    .isInt({ min: 0 }).withMessage('El stock debe ser un entero positivo'),
 
  body('department')
    .notEmpty().withMessage('El departamento es obligatorio')
    .isIn(['informatica', 'iot', 'electronica'])
    .withMessage('Departamento no válido'),
 
  body('available')
    .optional()
    .isBoolean().withMessage('available debe ser true o false'),
];
 
// Middleware que comprueba si hubo errores
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
 
module.exports = { createProductRules, validate };

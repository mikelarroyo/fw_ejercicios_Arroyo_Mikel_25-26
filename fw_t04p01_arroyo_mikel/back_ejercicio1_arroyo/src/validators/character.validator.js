const {body} = require('express-validator');

const characterCreateRules = [
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio'),
    
    body('age')
        .notEmpty().withMessage('La edad es obligaoria')
        .isNumeric().withMessage('La edad debe ser un numero'),
    body('species')
        .notEmpty().withMessage('La especie es obligatoria')
        .isString().withMessage('La especie debe ser texto'),

];
const characterUpdateRules = [
    body('name')
        .optional()
        .notEmpty().withMessage('El nombre no puede estar vacío'),
    body('age')
        .optional()
        .isNumeric().withMessage('La edad debe ser un número'),
    body('species')
        .optional()
        .isString().withMessage('La especie debe ser texto'),
];


module.exports = { characterCreateRules, characterUpdateRules } ;
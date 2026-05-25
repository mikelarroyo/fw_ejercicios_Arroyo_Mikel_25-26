const { body } = require('express-validator');

const episodeCreateRules = [
    body('code')
        .notEmpty().withMessage('El código es obligatorio')
        .matches(/^S\d{2}E\d{2}$/).withMessage('El código debe tener formato SxxExx'),

    body('title')
        .notEmpty().withMessage('El título es obligatorio'),

    body('year')
        .notEmpty().withMessage('El año es obligatorio')
        .isNumeric().withMessage('El año debe ser un número'),

    body('characters')
        .optional()
        .isArray().withMessage('characters debe ser un array'),
];

const episodeUpdateRules = [
    body('code')
        .optional()
        .matches(/^S\d{2}E\d{2}$/).withMessage('El código debe tener formato SxxExx'),

    body('title')
        .optional()
        .notEmpty().withMessage('El título no puede estar vacío'),

    body('year')
        .optional()
        .isNumeric().withMessage('El año debe ser un número'),

    body('characters')
        .optional()
        .isArray().withMessage('characters debe ser un array'),
];

module.exports = { episodeCreateRules, episodeUpdateRules };
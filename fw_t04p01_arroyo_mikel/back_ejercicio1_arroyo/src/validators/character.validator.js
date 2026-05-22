const {body} = require('express-validator');

const characterRules = [
    body('name')
        .notEmpty
]
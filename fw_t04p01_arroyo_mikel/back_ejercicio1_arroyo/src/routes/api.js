const router = require('express').Router();

router.use('/auth', require('./api/auth'));
router.use('/characters', require('./api/characters'));

module.exports = router;



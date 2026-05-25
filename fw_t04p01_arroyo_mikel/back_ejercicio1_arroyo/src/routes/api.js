const router = require('express').Router();

router.use('/auth', require('./api/auth'));
router.use('/characters', require('./api/characters'));
router.use('/episodes', require('./api/episodes'));

module.exports = router;



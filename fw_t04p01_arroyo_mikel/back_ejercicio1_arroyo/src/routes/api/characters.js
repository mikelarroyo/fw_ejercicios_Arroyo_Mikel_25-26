const router = require('express').Router();
const { checkToken } = require('../../middleware/auth.middleware');
const {
    getAllCharacters,
    getCharacterById,
    createCharacter,
    updateCharacter,
    deleteCharacter,
} = require('../../controllers/characters.controller');

router.get('/', checkToken, getAllCharacters);
router.get('/:id', checkToken, getCharacterById);
router.post('/', checkToken, createCharacter);
router.put('/:id', checkToken, updateCharacter);
router.delete('/:id', checkToken, deleteCharacter);

module.exports = router;

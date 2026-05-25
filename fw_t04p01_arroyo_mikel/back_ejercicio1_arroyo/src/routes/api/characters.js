const router = require('express').Router();
const { checkToken } = require('../../middleware/auth.middleware');
const { characterCreateRules, characterUpdateRules } = require('../../validators/character.validator');
const validate = require('../../validators/validate');
const {
    getAllCharacters,
    getCharacterById,
    createCharacter,
    updateCharacter,
    deleteCharacter,
} = require('../../controllers/characters.controller');

router.get('/', checkToken, getAllCharacters);
router.get('/:id', checkToken, getCharacterById);
router.post('/', checkToken, characterCreateRules, validate, createCharacter);
router.put('/:id', checkToken, characterUpdateRules, validate, updateCharacter);
router.delete('/:id', checkToken, deleteCharacter);

module.exports = router;

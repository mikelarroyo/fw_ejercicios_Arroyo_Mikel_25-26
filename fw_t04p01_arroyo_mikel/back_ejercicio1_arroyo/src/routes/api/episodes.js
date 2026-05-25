const router = require('express').Router();
const { checkToken } = require('../../middleware/auth.middleware');
const { episodeCreateRules, episodeUpdateRules } = require('../../validators/episode.validator');
const validate = require('../../validators/validate');
const {
    getAllEpisodes,
    getEpisodeById,
    createEpisode,
    updateEpisode,
    deleteEpisode,
} = require('../../controllers/episodes.controller');

router.get('/', checkToken, getAllEpisodes);
router.get('/:id', checkToken, getEpisodeById);
router.post('/', checkToken, episodeCreateRules, validate, createEpisode);
router.put('/:id', checkToken, episodeUpdateRules, validate, updateEpisode);
router.delete('/:id', checkToken, deleteEpisode);

module.exports = router;

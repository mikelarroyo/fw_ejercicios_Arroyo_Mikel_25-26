const mongoose = require('mongoose');
const Episode = require('../models/episodes.model');

const getAllEpisodes = async (req, res) => {
    try {
        const { season } = req.query;
        const filter = {};
        if (season) {
            filter.code = { $regex: `^S0${season}` };
        }
        const episodes = await Episode.find(filter);
        res.status(200).json(episodes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getEpisodeById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }
        const episode = await Episode.findById(id).populate('characters');
        if (!episode) return res.status(404).json({ error: 'Episodio no encontrado' });
        res.status(200).json(episode);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createEpisode = async (req, res) => {
    try {
        const episode = await Episode.create(req.body);
        res.status(201).json(episode);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateEpisode = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }
        const updated = await Episode.findByIdAndUpdate(id, req.body, { returnDocument: 'after' });
        if (!updated) return res.status(404).json({ error: 'Episodio no encontrado' });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteEpisode = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }
        const deleted = await Episode.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: 'Episodio no encontrado' });
        res.status(200).json({ message: 'Episodio eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllEpisodes, getEpisodeById, createEpisode, updateEpisode, deleteEpisode };

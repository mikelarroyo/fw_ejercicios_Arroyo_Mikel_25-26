const mongoose = require('mongoose');
const Character = require('../models/character.model');

const getAllCharacters = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const skip = (page - 1) * limit;

        const total = await Character.countDocuments();
        const characters = await Character.find().skip(skip).limit(limit);

        res.status(200).json({ total, page, limit, characters });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCharacterById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }
        const character = await Character.findById(id);
        if (!character) return res.status(404).json({ error: 'Personaje no encontrado' });
        res.status(200).json(character);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createCharacter = async (req, res) => {
    try {
        const character = await Character.create(req.body);
        res.status(201).json(character);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCharacter = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }
        const updated = await Character.findByIdAndUpdate(id, req.body, { returnDocument: 'after' });
        if (!updated) return res.status(404).json({ error: 'Personaje no encontrado' });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteCharacter = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }
        const deleted = await Character.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: 'Personaje no encontrado' });
        res.status(200).json({ message: 'Personaje eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllCharacters, getCharacterById, createCharacter, updateCharacter, deleteCharacter };
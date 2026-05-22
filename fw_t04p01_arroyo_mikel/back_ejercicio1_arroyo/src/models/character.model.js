const { Schema, model } = require('mongoose');

const characterSchema = new Schema(
    {
        name: String,
        img:String,
        age: Number,
        species: String,
        specialTraits: [String],
        role: String,
        firstAppearance: String,

    },
    {
        timestamps: true,
        verionKey: false,
    }
);
module.exports = model('Character', characterSchema);
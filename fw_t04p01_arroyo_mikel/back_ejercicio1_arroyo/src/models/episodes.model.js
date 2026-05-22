const {Schema, model} = require('mongoose');

const episodeSchema = new Schema(
    {
        code: String,
        title: String,
        summary: String,
        year: Number,
        characters: [{ type: Schema.Types.ObjectId, ref: 'Character' }],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = model('Episode', episodeSchema);
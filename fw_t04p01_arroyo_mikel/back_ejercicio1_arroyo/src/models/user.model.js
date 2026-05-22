const {Schema, model} = require('mongoose');

const userSchema = new Schema(
    {
        username: String,
        email: {
        type: String,
        unique:true,
        required:true,
    },
        password: {
        type: String,
        required:true,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
    
);
module.exports = model('User', userSchema);
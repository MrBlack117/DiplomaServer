const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    likedTests: [
        {
            ref: 'tests',
            type: Schema.Types.ObjectId
        }
    ],
    dislikedTests: [
        {
            ref: 'tests',
            type: Schema.Types.ObjectId
        }
    ],
    isPsychologist: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('users', userSchema);
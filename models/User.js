const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
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
    role:{
        type: String,
        default: 'user'
    }
});

module.exports = mongoose.model('users', userSchema);
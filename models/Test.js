const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId,
        required: true
    },
    processingType: {
        type: String,
        required: true
    },
    brief: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    },
    imageSrc: {
        type: String,
        default: ''
    },
    possibleResults: [
        {
            ref: 'possibleResults',
            type: Schema.Types.ObjectId
        }
    ],
    questions: [
        {
            ref: 'questions',
            type: Schema.Types.ObjectId
        }
    ],
    comments: [
        {
            ref: 'comments',
            type: Schema.Types.ObjectId
        }
    ],
    usersResults: [
        {
            ref: 'UserTestResult',
            type: Schema.Types.ObjectId
        }
    ],
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    }
});


module.exports = mongoose.model('tests', testSchema)
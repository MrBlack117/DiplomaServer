const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const possibleResultSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageSrc: {
        type: String,
        default: ''
    },
    testId: {
        ref: 'tests',
        type: Schema.Types.ObjectId,
        required: true
    },
    minScore: {
        type: Number,
        default: 0
    },
    maxScore: {
        type: Number,
        default: 0
    },
    scores: [{
        answerOptionId: {
            ref: 'answerOptions',
            type: Schema.Types.ObjectId,
            required: true
        },
        points: {
            type: Number,
            required: true
        }
    }]
});

module.exports = mongoose.model('PossibleResult', possibleResultSchema);

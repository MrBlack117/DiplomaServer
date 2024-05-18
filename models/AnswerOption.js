const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerOptionSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    questionId: {
        ref: 'questions',
        type: Schema.Types.ObjectId,
        required: true
    },
    possibleResultId: {
        ref: 'possibleResults',
        type: Schema.Types.ObjectId,
        default: ''
    },
    score: {
        type: Number,
        default: 0
    },
    imageSrc: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('answerOptions', answerOptionSchema);
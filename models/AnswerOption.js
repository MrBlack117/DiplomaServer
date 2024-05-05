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
        required: true
    },
    score: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('answerOptions', answerOptionSchema);
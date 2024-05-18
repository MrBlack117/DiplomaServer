const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userTestResultSchema = new Schema({
    test: {
        type: Schema.Types.ObjectId,
        ref: 'Test', // Посилання на схему тесту
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Посилання на схему користувача
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    score: {
        type: Number,
        default: 0
    },
    results: [
        {
            possible_result_id: {
                type: Schema.Types.ObjectId,
                ref: 'PossibleResult' // Посилання на схему можливого результату
            },
            score: {
                type: Number,
                default: 0
            }
        }
    ],
    answers:[
        {
            type: Schema.Types.ObjectId,
            ref: 'AnswerOption'
        }
    ]
});

module.exports = mongoose.model('UserTestResult', userTestResultSchema);
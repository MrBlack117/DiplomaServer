const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    text: {
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
    answerOptions: [
        {
            ref: 'answerOptions',
            type: Schema.Types.ObjectId
        }
    ]
});

module.exports = mongoose.model('questions', questionSchema);
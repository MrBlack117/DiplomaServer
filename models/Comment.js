const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    testId: {
        ref: 'tests',
        type: Schema.Types.ObjectId,
        required: true
    },
    userId: {
        ref: 'users',
        type: Schema.Types.ObjectId,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('comments', commentSchema);
const AnswerOption = require('../models/AnswerOption')
const Question = require('../models/Question')
const PossibleResult = require('../models/PossibleResult');
const errorHandler = require('../utils/errorHandler');


module.exports.getByQuestionId = async function (req, res) {
    try {
        const answerOptions = await AnswerOption.find({
            questionId: req.params.questionId
        })
        res.status(200).json(answerOptions);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.geById = async function (req, res) {
    try {
        const answerOption = await AnswerOption.findById(req.params.id)
        res.status(200).json(answerOption);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.create = async function (req, res) {
    const answerOption = new AnswerOption({
        text: req.body.text,
        questionId: req.body.questionId,
        possibleResultId: req.body.possibleResultId,
        score: req.body.score
    });

    try {
        const savedOption = await answerOption.save();
        await Question.findByIdAndUpdate(req.body.questionId, { $push: { answerOptions: savedOption._id } });
        res.status(201).json(savedOption);
    } catch (e) {
        errorHandler(res, e);
    }
};

module.exports.delete = async function (req, res) {
    try {
        await Question.updateOne({answerOptions: req.params.id}, {$pull: {answerOptions: req.params.id}})
        await AnswerOption.deleteOne({_id: req.params.id});
        res.status(200).json({
            message: 'Answer option deleted'
        });
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.update = async function (req, res) {
    try {
        const answerOption = await AnswerOption.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true}
        );
        res.status(200).json(answerOption);
    } catch (e) {
        errorHandler(res, e);
    }
}


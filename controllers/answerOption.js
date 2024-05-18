const AnswerOption = require('../models/AnswerOption')
const Question = require('../models/Question')
const errorHandler = require('../utils/errorHandler');
const firebaseController = require('./firebaseStorage');
require("../models/Test");
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
    let imageUrl = '';
    try {
        if (req.file) {
            imageUrl = await firebaseController.uploadFile(req.file.buffer, req.file.originalname);
        }
    } catch (err) {
        errorHandler(res, err);
    }



    const answerOption = new AnswerOption({
        text: req.body.text,
        questionId: req.body.questionId,
        possibleResultId: req.body.possibleResultId,
        score: req.body.score,
        imageSrc: imageUrl
    });

    try {
        const savedOption = await answerOption.save();
        await Question.findByIdAndUpdate(req.body.questionId, {$push: {answerOptions: savedOption._id}});
        res.status(201).json(savedOption);
    } catch (e) {
        errorHandler(res, e);
    }
};

module.exports.delete = async function (req, res) {
    try {
        await Question.updateOne({answerOptions: req.params.id}, {$pull: {answerOptions: req.params.id}})
        const answerOption = await AnswerOption.findByIdAndDelete({_id: req.params.id});

        if (answerOption.imageSrc) {
            await firebaseController.deleteFileByUrl(answerOption.imageSrc);
        }

        res.status(200).json({
            message: 'Answer option deleted'
        });
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.update = async function (req, res) {
    const updated = {
        text: req.body.text,
        questionId: req.body.questionId,
        possibleResultId: req.body.possibleResultId,
        score: req.body.score
    }

    if (req.file) {
        const oldAnswerOption = await AnswerOption.findById(req.params.id);
        console.log(oldAnswerOption)
        if (oldAnswerOption.imageSrc) {
            try {
                await firebaseController.deleteFileByUrl(oldAnswerOption.imageSrc);
            } catch (err) {
                errorHandler(res, err);
            }
        }
        updated.imageSrc = await firebaseController.uploadFile(req.file.buffer, req.file.originalname);
    }


    try {
        const answerOption = await AnswerOption.findOneAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
        );
        res.status(200).json(answerOption);
    } catch (e) {
        errorHandler(res, e);
    }
}


const Question = require('../models/Question')
const Test = require('../models/Test')
const AnswerOption = require('../models/AnswerOption')
const errorHandler = require('../utils/errorHandler');
const firebaseController = require("./firebaseStorage");

module.exports.getByTestId = async function (req, res) {
    try {
        const questions = await Question.find({
            testId: req.params.testId
        })
        res.status(200).json(questions);
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

    const question = new Question({
        text: req.body.text,
        testId: req.body.testId,
        imageSrc: imageUrl
    });

    question.save().then(result => {
        res.status(201).json(result);
        return Test.findByIdAndUpdate(req.body.testId, {$push: {questions: result._id}});
    })
        .then(() => {
            console.log('Question added to test successfully');
        })
        .catch(err => {
            errorHandler(res, err);
        });
};


module.exports.delete = async function (req, res) {
    try {
        await Test.updateOne({questions: req.params.id}, {$pull: {questions: req.params.id}})

        const question = await Question.findByIdAndDelete({_id: req.params.id})

        if (question.imageSrc) {
            await firebaseController.deleteFileByUrl(question.imageSrc);
        }

        for (const answerOptionId of question.answerOptions) {
            await AnswerOption.findByIdAndDelete({_id: answerOptionId})
        }

        res.status(200).json({
            message: 'Question deleted'
        });
    } catch (e) {
        errorHandler(res, e);
    }

}

module.exports.update = async function (req, res) {

    const updated = {
        text: req.body.text,
        testId: req.body.testId,
    }

    if (req.file) {
        const oldQuestion= await Question.findById(req.params.id);
        if (oldQuestion.imageSrc) {
            try {
                await firebaseController.deleteFileByUrl(oldQuestion.imageSrc);
            } catch (err) {
                errorHandler(res, err);
            }
        }
        updated.imageSrc = await firebaseController.uploadFile(req.file.buffer, req.file.originalname);
    }

    try {
        const question = await Question.findOneAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
        );
        res.status(200).json(question);
    } catch (e) {
        errorHandler(res, e);
    }
}




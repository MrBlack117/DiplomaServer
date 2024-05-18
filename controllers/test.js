const Test = require('../models/Test');
const Question = require('../models/Question');
const AnswerOption = require('../models/AnswerOption');
const Comment = require('../models/Comment')
const PossibleResult = require('../models/PossibleResult')
const User = require('../models/User');
const errorHandler = require('../utils/errorHandler');
const UserTestResult = require("../models/UserTestResult");
const firebaseController = require('./firebaseStorage');

module.exports.getById = async function (req, res) {
    try {
        const test = await Test.findById(req.params.id);
        if (test) {
            res.status(200).json(test);
        } else {
            res.status(404).json({
                message: 'Test not exists'
            });
        }
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.getByUser = async function (req, res) {
    try {
        const tests = await Test.find({
            user: req.user.id
        })
        res.status(200).json(tests);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.getAll = async function (req, res) {
    try {
        const tests = await Test.find();
        if (tests) {
            res.status(200).json(tests);
        } else {
            res.status(404).json({
                message: 'Test not exists'

            });
        }
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.create = async function (req, res) {
    let imageUrl = '';
    try {
        if (req.file) {
            imageUrl = await firebaseController.uploadFile(req.file.buffer, req.file.originalname );
        }
    } catch (err) {
        errorHandler(res, err);
    }

    const test = new Test({
        name: req.body.name,
        brief: req.body.brief,
        description: req.body.description,
        user: req.user.id,
        processingType: req.body.processingType,
        imageSrc: imageUrl
    });
    test.save().then(test => {
        res.status(201).json(test);
    }).catch(err => {
        errorHandler(res, err);
    });
}

module.exports.delete = async function (req, res) {
    try {
        const test = await Test.findByIdAndDelete({_id: req.params.id});

        if (test.imageSrc) {
            await firebaseController.deleteFileByUrl(test.imageSrc);
        }

        for (const questionId of test.questions) {
            const question = await Question.findOneAndDelete({_id: questionId});

            for (const answerOptionId of question.answerOptions) {
                await AnswerOption.findByIdAndDelete({_id: answerOptionId})
            }
        }
        for (const commentId of test.comments) {
            await Comment.findByIdAndDelete({_id: commentId})
        }
        for (const possibleResultId of test.possibleResults) {
            const possibleResult = await PossibleResult.findByIdAndDelete({_id: possibleResultId})
            if(possibleResult.imageSrc){
                await firebaseController.deleteFileByUrl(possibleResult.imageSrc)
            }
        }

        for (const userResultId of test.usersResults) {
            await UserTestResult.findByIdAndDelete({_id: userResultId})
        }

        res.status(200).json({
            message: 'Test deleted'
        });
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.update = async function (req, res) {
    const updated = {
        name: req.body.name,
        brief: req.body.brief,
        description: req.body.description,
        processingType: req.body.processingType
    }

    if (req.file) {
        const oldTest = await Test.findById(req.params.id);
        if (oldTest.imageSrc) {
            try {
                await firebaseController.deleteFileByUrl(oldTest.imageSrc);
            } catch (err) {
                errorHandler(res, err);
            }
        }
        updated.imageSrc = await firebaseController.uploadFile(req.file.buffer, req.file.originalname);
    }

    try {
        const test = await Test.findOneAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
        );
        res.status(200).json(test);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.addReaction = async function (req, res) {
    const testId = req.params.id;
    const userId = req.user.id;
    try {
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({
                message: 'Test not exists'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const reaction = req.body.reaction;
        if (reaction === 'like') {
            if (user.likedTests.includes(testId)) {
                return res.status(200).json({
                    message: 'Already liked'
                });
            } else {
                if (user.dislikedTests.includes(testId)) {
                    user.dislikedTests.pull(testId);
                    test.dislikes -= 1;
                    await User.findByIdAndUpdate(userId, {$pull: {dislikedTests: testId}});
                }
                test.likes += 1;
                await Promise.all([test.save(), User.findByIdAndUpdate(userId, {$push: {likedTests: testId}})]);
                res.status(200).json({
                    message: 'Like added successfully'
                });
            }
        } else if (reaction === 'dislike') {
            if (user.dislikedTests.includes(testId)) {
                return res.status(200).json({
                    message: 'Already disliked'
                });
            } else {
                if (user.likedTests.includes(testId)) {
                    user.likedTests.pull(testId);
                    test.likes -= 1;
                    await User.findByIdAndUpdate(userId, {$pull: {likedTests: testId}});
                }
                test.dislikes += 1;
                await Promise.all([test.save(), User.findByIdAndUpdate(userId, {$push: {dislikedTests: testId}})]);
                res.status(200).json({
                    message: 'Dislike added successfully'
                });
            }
        } else {
            return res.status(400).json({
                message: 'Reaction not found'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

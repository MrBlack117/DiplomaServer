const UserTestResult = require('../models/UserTestResult')
const errorHandler = require('../utils/errorHandler');
const Test = require("../models/Test");


module.exports.getById = async function (req, res) {
    try {
        const userTestResult = await UserTestResult.findById(req.params.id);
        res.status(200).json(userTestResult);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.getByTestId = async function (req, res) {
    try {
        const userTestResults = await UserTestResult.find({
            test: req.params.testId
        })
        res.status(200).json(userTestResults);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.getByUser = async function (req, res) {
    try {
        const userTestResults = await UserTestResult.find({
            user: req.user.id
        })
        res.status(200).json(userTestResults);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.create = function (req, res) {
    const userTestResult = new UserTestResult({
        test: req.body.test,
        user: req.user?.id,
        score: req.body.score,
        results: req.body.results,
        answers: req.body.answers,
        textAnswers: req.body.textAnswers
    });
    userTestResult.save().then(result => {
            res.status(201).json(result);
            return Test.findByIdAndUpdate(req.body.test, {$push: {usersResults: result._id}})
        }
    ).then(result => {
        console.log('Result created');
    }).catch(err => {
        errorHandler(res, err);
    });
}

module.exports.delete = async function (req, res) {
    try {
        await UserTestResult.deleteOne({_id: req.params.id});
        res.status(200).json({
            message: 'User test result deleted'
        });
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.update = async function (req, res) {
    try {
        const comment = await UserTestResult.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true}
        );
        res.status(200).json(comment);
    } catch (e) {
        errorHandler(res, e);
    }
}


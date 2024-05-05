const PossibleResult = require('../models/PossibleResult')
const Test = require('../models/Test')
const errorHandler = require('../utils/errorHandler');
const UserTestResult = require("../models/UserTestResult");


module.exports.getByTestId = async function (req, res) {
    try {
        const possibleResults = await PossibleResult.find({
            testId: req.params.testId
        })
        res.status(200).json(possibleResults);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.getById = async function (req, res) {
    try {
        const userTestResult = await PossibleResult.findById(req.params.id);
        res.status(200).json(userTestResult);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.create = function (req, res) {
    const possibleResult = new PossibleResult({
        name: req.body.name,
        description: req.body.description,
        testId: req.body.testId,
        imageSrc: req.file ? req.file.path : ''
    });
    possibleResult.save().then(result => {
            res.status(201).json(possibleResult);
            return Test.findByIdAndUpdate(req.body.testId, {$push: {possibleResults: result._id}})
        }
    ).then(result => {
        console.log('Possible result added to test');
    }).catch(err => {
        errorHandler(res, err);
    });
}

module.exports.delete = async function (req, res) {
    try {
        await Test.updateOne({possibleResults: req.params.id}, {$pull: {possibleResults: req.params.id}})
        await PossibleResult.deleteOne({_id: req.params.id});
        res.status(200).json({
            message: 'Possible result deleted'
        });
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.update = async function (req, res) {
    try {
        const possibleResult = await PossibleResult.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true}
        );
        res.status(200).json(possibleResult);
    } catch (e) {
        errorHandler(res, e);
    }
}


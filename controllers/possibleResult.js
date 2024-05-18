const PossibleResult = require('../models/PossibleResult')
const Test = require('../models/Test')
const errorHandler = require('../utils/errorHandler');
const firebaseController = require('./firebaseStorage');


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

module.exports.create = async function (req, res) {

    let imageUrl = '';
    try {
        if (req.file) {
            imageUrl = await firebaseController.uploadFile(req.file.buffer, req.file.originalname);
        }
    } catch (err) {
        errorHandler(res, err);
    }

    const possibleResult = new PossibleResult({
        name: req.body.name,
        description: req.body.description,
        testId: req.body.testId,
        maxScore: req.body.maxScore,
        minScore: req.body.minScore,
        imageSrc: imageUrl
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
        const possibleResult = await PossibleResult.findByIdAndDelete({_id: req.params.id});
        if (possibleResult.imageSrc) {
            await firebaseController.deleteFileByUrl(possibleResult.imageSrc);
        }
        res.status(200).json({
            message: 'Possible result deleted'
        });
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.update = async function (req, res) {
    const updated = {
        name: req.body.name,
        description: req.body.description,
        testId: req.body.testId,
        maxScore: req.body.maxScore,
        minScore: req.body.minScore
    }

    if (req.file) {
        const oldPossibleResult = await PossibleResult.findById(req.params.id);
        if (oldPossibleResult.imageSrc) {
            try {
                await firebaseController.deleteFileByUrl(oldPossibleResult.imageSrc);
            } catch (err) {
                errorHandler(res, err);
            }
        }
        updated.imageSrc = await firebaseController.uploadFile(req.file.buffer, req.file.originalname);
    }

    try {
        const possibleResult = await PossibleResult.findOneAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
        );
        res.status(200).json(possibleResult);
    } catch (e) {
        errorHandler(res, e);
    }
}


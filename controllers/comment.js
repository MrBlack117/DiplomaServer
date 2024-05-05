const Comment = require('../models/Comment')
const Test = require('../models/Test')
const errorHandler = require('../utils/errorHandler');
const {response} = require("express");


module.exports.getById = async function (req, res) {
    try {
        const comment = await Comment.findById(req.params.id);
        res.status(200).json({
            option: comment
        });
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.getByTestId = async function (req, res) {
    try {
        const comments = await Comment.find({
            testId: req.params.testId
        })
        res.status(200).json(comments)
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.create = function (req, res) {
    const comment = new Comment({
        text: req.body.text,
        testId: req.body.testId,
        userId: req.user.id
    });
    comment.save().then(result => {
            res.status(201).json({
                message: 'Comment created',
                comment: result
            });
            return Test.findByIdAndUpdate(req.body.testId, {$push: {comments: result._id}})
        }
    ).then(result => {
        console.log('Comment added to test');
    }).catch(err => {
        errorHandler(res, err);
    });
}

module.exports.delete = async function (req, res) {
    try {
        await Test.updateOne({comments: req.params.id}, {$pull: {comments: req.params.id}})
        await Comment.deleteOne({_id: req.params.id});
        res.status(200).json({
            message: 'Comment deleted'
        });
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.update = async function (req, res) {
    try {
        const comment = await Comment.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true}
        );
        res.status(200).json(comment);
    } catch (e) {
        errorHandler(res, e);
    }
}


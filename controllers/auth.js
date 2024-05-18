const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const errorHandler = require('../utils/errorHandler');
const key = 'super_secret_key'


module.exports.login = async function (req, res) {
    const candidate = await User.findOne({email: req.body.signInEmail});
    if (candidate) {
        const passwordResult = bcrypt.compareSync(req.body.signInPassword, candidate.password);
        if (passwordResult) {
            const token = jwt.sign({
                _id: candidate._id,
                name: candidate.name
            }, key, {expiresIn: '8h'});
            res.status(200).json({
                message: 'Login successful!',
                token: 'Bearer ' + token,
                userData: {
                    name: candidate.name,
                    email: candidate.email
                }
            });
        } else {
            res.status(401).json({
                message: 'Wrong password!'
            });
        }
    } else {
        res.status(404).json({
            message: 'User not exists!'
        });
    }

}

module.exports.register = async function (req, res) {
    const candidate = await User.findOne({email: req.body.signUpEmail});
    if (candidate) {
        res.status(409).json({
            message: 'User already exists!'
        });
    } else {
        const salt = bcrypt.genSaltSync(10);
        const password = req.body.signUpPassword;
        const user = new User({
            email: req.body.signUpEmail,
            password: bcrypt.hashSync(password, salt),
            name: req.body.signUpName
        });
        const token = jwt.sign({
            _id: user._id,
            name: user.name
        }, key, {expiresIn: '8h'});
        user.save().then(result => {
            res.status(201).json({
                result: result,
                message: 'Login successful!',
                token: 'Bearer ' + token,
                userData: {
                    name: user.name,
                    email: user.email
                }
            });
        }).catch(err => {
            errorHandler(res, err);
        });
    }

}

module.exports.getUser = async function (req, res) {


    try {
        const user = await User.findById(req.params.userId)
        res.status(200).json(user)
    } catch (e) {
        errorHandler(res, e);
    }


}

module.exports.getUserByEmail = async function (req, res) {
    try {
        const user = await User.findOne({email: req.params.email});
        res.status(200).json(user);
    } catch (e) {
        errorHandler(res, e)
    }
}


module.exports.googleAuth = async function (req, res) {
    const candidate = await User.findOne({email: req.body.email});
    if (candidate) {
        const token = jwt.sign({
            _id: candidate._id,
            name: candidate.name
        }, key, {expiresIn: '8h'});
        res.status(200).json({
            message: 'Login successful!',
            token: 'Bearer ' + token,
            userData: {
                name: candidate.name,
                email: candidate.email
            }
        });
    } else {
        const user = new User({
            email: req.body.email,
            name: req.body.name
        });
        const token = jwt.sign({
            _id: user._id,
            name: user.name
        }, key, {expiresIn: '8h'});
        user.save().then(result => {
            res.status(201).json({
                result: result,
                message: 'Login successful!',
                token: 'Bearer ' + token,
                userData: {
                    name: user.name,
                    email: user.email
                }
            });
        }).catch(err => {
            errorHandler(res, err);
        });
    }

}
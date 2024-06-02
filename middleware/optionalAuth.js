const jwt = require('jsonwebtoken');
const User = require('../models/User');
const key = 'super_secret_key';

async function optionalAuth(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, key);
            const user = await User.findById(decoded._id);

            if (user) {
                req.user = user;
            }
        } catch (err) {
            console.error('Ошибка аутентификации:', err);
        }
    }

    next();
}

module.exports = optionalAuth;

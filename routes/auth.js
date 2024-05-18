const express = require('express')
const controller = require('../controllers/auth')
const router = express.Router();

router.post('/login', controller.login);
router.post('/register', controller.register);
router.post('/googleAuth', controller.googleAuth);
router.get('/user/:userId', controller.getUser)
router.get('/user/email/:email', controller.getUserByEmail)

module.exports = router
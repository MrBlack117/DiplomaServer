const express = require('express');
const router = express.Router();
const userTestResultController = require('../controllers/userTestResult');
const passport = require('passport');

router.get('/user', passport.authenticate('jwt', {session: false}), userTestResultController.getByUser);
router.get('/test/:testId', userTestResultController.getByTestId);
router.get('/:id', userTestResultController.getById);
router.post('/', passport.authenticate('jwt', {session: false}), userTestResultController.create);
router.patch('/:id', passport.authenticate('jwt', {session: false}), userTestResultController.update);
router.delete('/:id', passport.authenticate('jwt', {session: false}), userTestResultController.delete);

module.exports = router;

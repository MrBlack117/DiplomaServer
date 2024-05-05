const express = require('express');
const router = express.Router();
const controller = require('../controllers/question');
const passport = require('passport');

router.get('/:testId', controller.getByTestId); // get by questionId or answerOptionId
router.post('/', passport.authenticate('jwt', {session: false}), controller.create);
router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.update);
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.delete);

module.exports = router;
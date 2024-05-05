const express = require('express');
const router = express.Router();
const controller = require('../controllers/answerOption');
const passport = require('passport');

router.get('/:id', controller.geById);
router.get('/question/:questionId', controller.getByQuestionId); // get by questionId or answerOptionId
router.post('/', passport.authenticate('jwt', {session: false}), controller.create);
router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.update);
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.delete);

module.exports = router;
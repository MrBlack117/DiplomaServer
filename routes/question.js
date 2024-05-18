const express = require('express');
const router = express.Router();
const controller = require('../controllers/question');
const passport = require('passport');
const upload = require('../middleware/upload');

router.get('/:testId', controller.getByTestId); // get by questionId or answerOptionId
router.post('/', upload.single('image'), passport.authenticate('jwt', {session: false}), controller.create);
router.patch('/:id', upload.single('image'), passport.authenticate('jwt', {session: false}), controller.update);
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.delete);

module.exports = router;
const express = require('express');
const router = express.Router();
const controller = require('../controllers/comment');
const passport = require('passport');

router.get('/:id', controller.getById);
router.get('/test/:testId', controller.getByTestId)
router.post('/', passport.authenticate('jwt', {session: false}), controller.create);
router.put('/:id', passport.authenticate('jwt', {session: false}), controller.update);
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.delete);

module.exports = router;
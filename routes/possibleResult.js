const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const possibleResultController = require('../controllers/possibleResult');
const passport = require('passport');

router.get('/test/:testId', possibleResultController.getByTestId);
router.get('/:id', possibleResultController.getById);
router.post('/', upload.single('image'), passport.authenticate('jwt', {session: false}), possibleResultController.create);
router.patch('/:id',upload.single('image'), passport.authenticate('jwt', {session: false}), possibleResultController.update);
router.delete('/:id', passport.authenticate('jwt', {session: false}), possibleResultController.delete);


module.exports = router;
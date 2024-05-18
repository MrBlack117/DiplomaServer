const express = require('express');
const passport = require('passport');
const upload = require('../middleware/upload');
const router = express.Router();
const controller = require('../controllers/test');



router.post('/', upload.single('image'), passport.authenticate('jwt', {session: false}), controller.create);
router.patch('/:id', upload.single('image'), passport.authenticate('jwt', {session: false}), controller.update);
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.delete);
router.get('/user', passport.authenticate('jwt', {session: false}), controller.getByUser);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/reaction/:id', passport.authenticate('jwt', {session: false}), controller.addReaction)


module.exports = router;
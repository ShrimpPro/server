const router = require('express').Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserDetail);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.patch('/membership/:id', userController.updateMembership);

module.exports = router;
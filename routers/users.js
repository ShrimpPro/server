const router = require('express').Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUsers);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/:id', userController.getUserDetail);
router.put('/:id', userController.updateUser);
router.patch('/membership/:id', userController.updateMembership);

module.exports = router;
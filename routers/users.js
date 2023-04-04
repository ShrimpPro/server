const router = require('express').Router();
const userController = require('../controllers/userController');
const { authentication } = require('../middlewares/authentication');

router.get('/', userController.getUsers);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/current', authentication, userController.currentUser);
router.patch('/expo', authentication, userController.expoToken);
router.get('/:id', userController.getUserDetail);
router.put('/:id', userController.updateUser);
router.patch('/membership/:id', userController.updateMembership);

module.exports = router;
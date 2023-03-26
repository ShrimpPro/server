const router = require('express').Router();
const userRouter = require('./users');
const iotRouter = require('./iot');
const partnerRouter = require('./partners');
const errorHandler = require('../middlewares/errorHandler');

router.use('/users', userRouter);
router.use('/iot', iotRouter);
router.use('/partners', partnerRouter);
router.use(errorHandler);

module.exports = router;
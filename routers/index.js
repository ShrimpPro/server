const router = require('express').Router();
const userRouter = require('./users');
const iotRouter = require('./iot');
const partnerRouter = require('./partners');
const paymentRouter = require('./payment');
const { errorHandler } = require('../middlewares/errorHandler');
const { authentication } = require('../middlewares/authentication');


router.use('/users', userRouter);
router.use('/iot', iotRouter);
router.post('/testpaid',(req, rest) => rest.send('Failed'))
router.use('/partners', authentication, partnerRouter);
router.use('/payments', authentication, paymentRouter);
router.use(errorHandler);


module.exports = router;
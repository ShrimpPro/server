const router = require('express').Router();
const userRouter = require('./users');
const iotRouter = require('./iot');
const partnerRouter = require('./partners');
const errorHandler = require('../middlewares/errorHandler');
const app = express();
let payment = require("./payment");

router.use('/users', userRouter);
router.use('/iot', iotRouter);
router.use('/partners', partnerRouter);
router.use(errorHandler);
app.use("/payments", payment);


module.exports = { router, app };
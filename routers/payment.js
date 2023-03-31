const router = require('express').Router();
const PaymentController = require('../controllers/paymentController');
const { authentication } = require('../middlewares/authentication');

router.get("/invoice", authentication, PaymentController.createInvoice);
router.get("/payout", authentication, PaymentController.createPayout);

module.exports = router;

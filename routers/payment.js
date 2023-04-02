const router = require('express').Router();
const PaymentController = require('../controllers/paymentController');

router.get("/invoice", PaymentController.createInvoice);
router.get("/paid",PaymentController.paid)
// router.get("/payout", PaymentController.createPayout);

module.exports = router;

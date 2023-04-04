const router = require('express').Router();
const PaymentController = require('../controllers/paymentController');

router.post("/invoice", PaymentController.createInvoice);
router.post("/paid",PaymentController.paid)

module.exports = router;

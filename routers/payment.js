const router = require('express').Router();
const PaymentController = require('../controllers/paymentController');
const authentication = require("../middlewares/authentication");

router.get("/invoice", PaymentController.createInvoice);
router.get("/payout", PaymentController.createPayout);

module.exports = router;

const router = require('express').Router();
const PaymentController = require('../controllers/paymentController');
const { authentication } = require('../middlewares/authentication');

router.post("/invoice", authentication, PaymentController.createInvoice);
router.post("/paid",PaymentController.paid)
// router.get("/payout", PaymentController.createPayout);

module.exports = router;

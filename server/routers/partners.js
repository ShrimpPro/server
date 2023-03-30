const router = require('express').Router();
const partnerController = require('../controllers/partnerController');

router.get('/temp', partnerController.getTemp);
router.get('/ph', partnerController.getPh);
router.get('/histories', partnerController.getHistories);

module.exports = router;
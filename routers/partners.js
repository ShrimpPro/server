const router = require('express').Router();
const partnerController = require('../controllers/partnerController');

router.get('/ponds', partnerController.getPonds);

module.exports = router;
const router = require('express').Router();
const iotController = require('../controllers/iotController');

router.get('/devices', iotController.getAllDevices);
router.get('/devices/:pondId', iotController.findDevice);

module.exports = router;
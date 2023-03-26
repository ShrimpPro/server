const router = require('express').Router();
const iotController = require('../controllers/iotController');

router.get('/data', iotController.getData);
router.post('/data', iotController.createData);

module.exports = router;
const router = require('express').Router();
const partnerController = require('../controllers/partnerController');

router.get('/ponds', partnerController.getPonds);
router.post('/ponds', partnerController.addDeviceAndPond);
router.get('/harvests', partnerController.getHarvests);
router.get('/harvests/:id', partnerController.findHarvest);
router.post('/harvests/:pondId', partnerController.addHarvest);
router.put('/harvests/:id', partnerController.updateHarvest);
router.delete('/harvests/:id', partnerController.deleteHarvest);

module.exports = router;
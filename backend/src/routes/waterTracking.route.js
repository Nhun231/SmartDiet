const express = require('express');
const router = express.Router();
const controller = require('../controllers/waterTracking.controller');
const verifyJWTs = require('../middlewares/verifyJWTs');

router.use(verifyJWTs);

router.get('/water-data', controller.getWaterData);
router.post('/add-water', controller.addWater);
router.put('/update-target', controller.updateTarget);
router.get('/get-report', controller.getWaterReport)
module.exports = router;

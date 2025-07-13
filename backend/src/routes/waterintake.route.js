const Router = require('express').Router;
const router = Router();
const waterIntakeControler = require('../controllers/waterintake.controler');

router.post('/', waterIntakeControler.createWaterIntake);
router.get('/', waterIntakeControler.getWaterIntakeByUserIdAndDate);
router.put('/', waterIntakeControler.updateWaterIntake);

module.exports = router;

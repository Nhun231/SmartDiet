const express = require('express');
const router = express.Router();
const premiumPackageController = require('../controllers/premiumPackage.controller');
const verifyJWTs = require('../middlewares/verifyJWTs');
const allowedRole = require('../middlewares/allowedRole');

// Public routes
router.get('/', premiumPackageController.getAllPremiumPackages);
router.get('/level/:level', premiumPackageController.getPremiumPackageByLevel);
router.get('/:id', premiumPackageController.getPremiumPackageById);

// Protected routes - require authentication
router.use(verifyJWTs);

// User routes
router.post('/upgrade', premiumPackageController.upgradeUserPackage);
router.get('/user/status', premiumPackageController.getUserPackageStatus);

// Admin routes
router.post('/', allowedRole(['admin']), premiumPackageController.createPremiumPackage);
router.put('/:id', allowedRole(['admin']), premiumPackageController.updatePremiumPackage);
router.delete('/:id', allowedRole(['admin']), premiumPackageController.deletePremiumPackage);

module.exports = router;

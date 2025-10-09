const express = require('express');
const router = express.Router();
const coinTransactionController = require('../controllers/coinTransaction.controller');
const verifyJWTs = require('../middlewares/verifyJWTs');
const allowedRole = require('../middlewares/allowedRole');

// User routes - require authentication
router.use(verifyJWTs);

// Create new coin transaction
router.post('/', coinTransactionController.createCoinTransaction);

// Get user's coin transactions
router.get('/user', coinTransactionController.getUserCoinTransactions);

// Admin routes - require admin role
router.get('/admin', allowedRole(['admin']), coinTransactionController.getAllCoinTransactions);
router.put('/admin/:transactionId', allowedRole(['admin']), coinTransactionController.updateTransactionStatus);
router.get('/admin/stats', allowedRole(['admin']), coinTransactionController.getTransactionStats);

module.exports = router;

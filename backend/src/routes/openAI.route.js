const express = require('express');
const router = express.Router();
const openAIController = require('../controllers/openAI.controller');

router.post('/chats', openAIController.testAi);

module.exports = router;
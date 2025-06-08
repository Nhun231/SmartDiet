const Router = require('express').Router;
const router = Router();
const emailController = require('../controllers/email.controller')

router.post('/send-test-email', emailController.sendTestEmail);
router.post('/welcomeOnboard', emailController.sendWelcomeOnboardEmail);
router.post('/forgotPassword', emailController.sendForgotPasswordEmail);

module.exports = router;
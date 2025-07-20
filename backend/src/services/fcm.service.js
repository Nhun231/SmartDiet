// services/fcm.service.js
const { google } = require('google-auth-library');
const axios = require('axios');
const path = require('path');
const serviceAccount = require(path.resolve(__dirname, '../../smart-diet-67dde-firebase-adminsdk-fbsvc-d314c7ab85.json'));

const SCOPES = ['https://www.googleapis.com/auth/firebase.messaging'];
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;

let cachedToken = null;
let tokenExpireTime = 0;

async function getAccessToken() {
    const now = Date.now();
    if (cachedToken && tokenExpireTime > now) {
        return cachedToken;
    }

    const jwtClient = new google.auth.JWT(
        serviceAccount.client_email,
        null,
        serviceAccount.private_key,
        SCOPES,
        null
    );

    const tokens = await jwtClient.authorize();
    cachedToken = tokens.access_token;
    tokenExpireTime = now + (tokens.expiry_date - now) - 60 * 1000;
    return cachedToken;
}

async function sendPushNotification(fcmToken, title, body, data = {}) {
    if (!fcmToken) throw new Error('Missing FCM token');

    const accessToken = await getAccessToken();
    const url = `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`;

    const message = {
        message: {
            token: fcmToken,
            notification: {
                title,
                body
            },
            data
        }
    };

    try {
        await axios.post(url, message, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('FCM send error:', error.response?.data || error.message);
        throw error;
    }
}

module.exports = { sendPushNotification };

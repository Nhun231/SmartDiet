

module.exports = (app) => {
    const express = require('express');
    const router = express.Router();

    // Example route
    router.get('/user', (req, res) => {
        res.send('test user');
    });

    app.use('/api', router);
};

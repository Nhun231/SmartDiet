const userRoutes = require('./user-route');

module.exports = (app) => {
    app.use('/api/users', userRoutes);
};
const userRoutes = require('./user-route');

const applicationName = process.env.APPLICATION_NAME;

module.exports = (app) => {
    app.use(`/${applicationName}/users`, userRoutes);
};
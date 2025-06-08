const userRoutes = require('./user-route');
const emailRoutes = require('./email-route');
const applicationName = process.env.APPLICATION_NAME;

module.exports = (app) => {
    app.use(`/${applicationName}/users`, userRoutes);
    app.use(`/${applicationName}/email`, emailRoutes);
};
const userRoutes = require('./user-route');
const calcuRoutes = require('./calculate.route');

const emailRoutes = require('./email-route');
const applicationName = process.env.APPLICATION_NAME;

module.exports = (app) => {
    app.use(`/${applicationName}/users`, userRoutes);
    app.use(`/${applicationName}/customers`, calcuRoutes);
    app.use(`/${applicationName}/email`, emailRoutes);
};
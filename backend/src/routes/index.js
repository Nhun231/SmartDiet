const customerRoutes = require('./customer.route');
const emailRoutes = require('./email-route');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const applicationName = process.env.APPLICATION_NAME;
module.exports = (app) => {
    app.use(`/${applicationName}/users`, userRoutes);
    app.use(`/${applicationName}/auth`, authRoutes);
    app.use(`/${applicationName}/email`, emailRoutes);
    app.use(`/${applicationName}/customer`, customerRoutes);
};
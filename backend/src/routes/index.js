const calcuRoutes = require('./calculate.route');

const emailRoutes = require('./email-route');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const applicationName = process.env.APPLICATION_NAME;
const verifyJWTs = require("../middlewares/verifyJWTs");
const waterTrackingRoutes = require('./waterTracking.route')
const waterReminderRoutes = require('./waterSchedule.route')
module.exports = (app) => {
    app.use(`/${applicationName}/users`, userRoutes);
    app.use(`/${applicationName}/auth`, authRoutes);
    app.use(`/${applicationName}/customers`, calcuRoutes);
    app.use(`/${applicationName}/water`, waterTrackingRoutes);
    app.use(`/${applicationName}/water-reminders`, waterReminderRoutes);
    // use JWT verification before each route needs it

    app.use(verifyJWTs) // middleware to send access token in header in each req
    // ... routes go here
    app.use(`/${applicationName}/email`, emailRoutes);
};
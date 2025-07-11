const calcuRoutes = require('./calculate.route');

const emailRoutes = require('./email-route');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const ingredientRoutes = require('./ingredient-route')
const mealRoutes = require('./meal-route')
const dishRoutes = require('./dish.route')
const openAIRoutes = require('./openAI.route');

const applicationName = process.env.APPLICATION_NAME;
const verifyJWTs = require("../middlewares/verifyJWTs");
const waterTrackingRoutes = require('./waterTracking.route')
const waterReminderRoutes = require('./waterSchedule.route')
module.exports = (app) => {
    app.use(`/${applicationName}/users`, userRoutes);
    app.use(`/${applicationName}/auth`, authRoutes);
    app.use(`/${applicationName}/email`, emailRoutes);
    app.use(`/${applicationName}/dish`, dishRoutes);
    app.use(`/${applicationName}/ai`, openAIRoutes);

    app.use(`/${applicationName}/water`, waterTrackingRoutes);
    app.use(`/${applicationName}/water-reminders`, waterReminderRoutes);
    // use JWT verification before each route needs it

    app.use(verifyJWTs) // middleware to send access token in header in each req
    // ... routes go here
    app.use(`/${applicationName}/customers`, calcuRoutes);
    app.use(`/${applicationName}/ingredients`, ingredientRoutes);
    app.use(`/${applicationName}/meals`, mealRoutes);
};
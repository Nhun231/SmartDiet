const customerRoutes = require('./customer.route');
const emailRoutes = require('./email-route');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const ingredientRoutes = require('./ingredient-route')
const mealRoutes = require('./meal-route')
const dishRoutes = require('./dish.route')
const openAIRoutes = require('./openAI.route');
const waterRoute = require('./waterintake.route')
const applicationName = process.env.APPLICATION_NAME;
const waterTrackingRoutes = require('./waterTracking.route')
const waterReminderRoutes = require('./waterSchedule.route')
module.exports = (app) => {
    app.use(`/${applicationName}/users`, userRoutes);
    app.use(`/${applicationName}/auth`, authRoutes);
    app.use(`/${applicationName}/email`, emailRoutes);
    app.use(`/${applicationName}/customer`, customerRoutes);
    app.use(`/${applicationName}/ingredients`, ingredientRoutes);
    app.use(`/${applicationName}/meals`, mealRoutes);
    app.use(`/${applicationName}/water`, waterTrackingRoutes);
    app.use(`/${applicationName}/email`, emailRoutes);
    app.use(`/${applicationName}/dish`, dishRoutes);
    app.use(`/${applicationName}/ai`, openAIRoutes);
    app.use(`/${applicationName}/water-reminders`, waterReminderRoutes);
    app.use(`/${applicationName}/water-intake`, waterRoute);
};
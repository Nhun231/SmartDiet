const customerRoutes = require('./customer.route');
const emailRoutes = require('./email-route');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const ingredientRoutes = require('./ingredient-route')
const mealRoutes = require('./meal-route')
const applicationName = process.env.APPLICATION_NAME;
module.exports = (app) => {
    app.use(`/${applicationName}/users`, userRoutes);
    app.use(`/${applicationName}/auth`, authRoutes);
    app.use(`/${applicationName}/email`, emailRoutes);
    app.use(`/${applicationName}/customer`, customerRoutes);
};    app.use(`/${applicationName}/ingredients`, ingredientRoutes);
app.use(`/${applicationName}/meals`, mealRoutes);
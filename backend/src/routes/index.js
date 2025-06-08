const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const applicationName = process.env.APPLICATION_NAME;
const verifyJWTs = require("../middlewares/verifyJWTs");
module.exports = (app) => {
    app.use(`/${applicationName}/users`, userRoutes);
    app.use(`/${applicationName}/auth`, authRoutes);
    // use JWT verification before each route needs it

    app.use(verifyJWTs) // middleware to send access token in header in each req
    // ... routes go here
};
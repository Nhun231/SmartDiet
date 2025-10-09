const path = require('path')
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require('morgan')
const testDbConnection = require("./src/config/testdb");
const { swaggerDocs } = require("./src/config/swagger");
const app = express();
const errorHandlerMiddleware = require("./src/middlewares/errorHandleMiddleware");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cron = require('node-cron'); // cron để gửi thông báo real-time
const { sendReminders } = require('./src/controllers/waterReminderSetting.controller');
const { initializeDefaultPackages, resetMonthlyCounters, checkExpiredPremium } = require('./src/services/premiumPackage.service');
// var corsOptions = {
//     origin: "http://localhost:5173",// co thể sau này nó là restfull api, để sẵn
//     credentials: true,
// }
app.use(morgan('combined')) //theo dõi log GET, POST...
app.use(cors({
    origin: true, // Reflects the request origin
    credentials: true,
})); //cross domain...

//app.use(express.static('public', {'extensions': ['jsx']} ));
//app.set('view engine', 'ejs');

require('./src/passport/googleStrategy');
app.use(passport.initialize());
// parse requests of content-type - application/json
app.use(bodyParser.json());

//middleware for cookies
app.use(cookieParser());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

testDbConnection();
console.log('APPLICATION_NAME:', process.env.APPLICATION_NAME);
require('./src/routes')(app);//importing route
console.log('Routes registered successfully');

// Root routes
app.get('/', (req, res) => {
    res.status(200).send('Server is running');
});
app.get("/ping", (req, res) => {
    res.status(200).send('pong');
});

// Middleware for centralized error handling
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}.`);
});
// Chạy cron mỗi phút
cron.schedule('* * * * *', async () => {
    console.log('Running water reminder job...');
    await sendReminders();
});

// Chạy cron mỗi ngày lúc 00:00 để reset monthly counters và check expired premium
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily premium maintenance...');
    await resetMonthlyCounters();
    await checkExpiredPremium();
});

swaggerDocs(app, PORT);
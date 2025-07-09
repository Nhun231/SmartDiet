const path = require('path')
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
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
const PORT = process.env.PORT || 8080;
// var corsOptions = {
//     origin: "http://localhost:5173",// co thể sau này nó là restfull api, để sẵn
//     credentials: true,
// }
app.use(morgan('combined')) //theo dõi log GET, POST...
swaggerDocs(app, PORT);
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
require('./src/routes')(app);//importing route

// Middleware for centralized error handling
app.use(errorHandlerMiddleware);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

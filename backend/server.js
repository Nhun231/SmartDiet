const path =require('path')
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require('morgan')
const testDbConnection = require("./src/config/testdb");
const {swaggerDocs} = require("./src/config/swagger");
const app = express();
const errorHandlerMiddleware = require("./src/middlewares/errorHandleMiddleware");

var corsOptions = {
    origin: "http://localhost:5173" // co thể sau này nó là resfull api, để sẵn
}
app.use(morgan('combined')) //theo dõi log GET, POST...

app.use(cors(corsOptions)); //cross domain...

//app.use(express.static('public', {'extensions': ['jsx']} ));
//app.set('view engine', 'ejs');


// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

testDbConnection();
require('./src/routes')(app);//importing route

//Middelware for centralized error handling
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
swaggerDocs(app, PORT);
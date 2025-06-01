const { StatusCodes } = require('http-status-codes');

const errorHandleMiddleware = (err, req, res, next) => {
    console.error(err.stack);

    //default error
    if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

    //get error
    const error = {
        statusCode: err.statusCode,
        message: err.message || 'An unexpected error occurred',
        stack: err.stack
    };

    res.status(error.statusCode).json(error)
};

module.exports = errorHandleMiddleware;
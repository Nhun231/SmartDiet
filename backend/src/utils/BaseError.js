class BaseError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = 'BaseError';
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = BaseError;
const Joi = require('joi');
const BaseError = require('../utils/BaseError');

const createUser = async (req, res, next) => {
    const condition = Joi.object({
        username: Joi.string().required(),
        password: Joi.string()
            .min(6)
            .max(15)
            .pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
            .required(),
        email: Joi.string()
            .email({ tlds: { allow: false } })
            .pattern(/^[^\s@]+@[^\s@]+\.[^\s@.]+(?:\.[^\s@.]+)?$/)
            .required(),
        dob: Joi.string()
    });

    try {
        await condition.validateAsync(req.body);
        next();
    } catch (error) {
        next(new BaseError(400, `Validation error: ${error.message}`));
    }
}

module.exports = {
    createUser
}
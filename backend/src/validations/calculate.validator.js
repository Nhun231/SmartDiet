const Joi = require('joi');
const BaseError = require('../utils/baseError.js');

const calculateSchema = Joi.object({
    gender: Joi.string().valid('Nam', 'Nữ').required()
        .messages({
            'any.required': 'Giới tính không được để trống.',
            'any.only': 'Giới tính chỉ có thể là "Nam" hoặc "Nữ".'
        }),

    age: Joi.number().min(10).max(120).required()
        .messages({
            'number.base': 'Tuổi phải là số.',
            'number.min': 'Tuổi tối thiểu là 10.',
            'number.max': 'Tuổi tối đa là 120.'
        }),

    height: Joi.number().min(100).max(250).required()
        .messages({
            'number.base': 'Chiều cao phải là số (cm).',
            'number.min': 'Chiều cao quá thấp (cm).',
            'number.max': 'Chiều cao quá cao (cm).'
        }),

    weight: Joi.number().min(30).max(300).required()
        .messages({
            'number.base': 'Cân nặng phải là số (kg).',
            'number.min': 'Cân nặng quá thấp (kg).',
            'number.max': 'Cân nặng quá cao (kg).'
        }),

    activity: Joi.string().valid('ít', 'nhẹ', 'vừa', 'nhiều', 'cực_nhiều').required()
        .messages({
            'any.required': 'Mức độ vận động không được để trống.',
            'any.only': 'Mức độ vận động không hợp lệ.'
        })
});

const validateCalculate = (req, res, next) => {
    const { error } = calculateSchema.validate(req.body, { abortEarly: false });

    if (error) {
        throw new BaseError(400, 'Dữ liệu không hợp lệ', error.details.map(e => e.message));
    }

    next();
};

module.exports = {
    validateCalculate
};

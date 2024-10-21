import Joi from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .required()
        .messages({
            'string.base': 'Team name must be a string',
            'string.empty': 'Team name is required',
            'string.min': 'Too short team name',
        }),
    
    email: Joi.string()
        .trim()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.base': 'Email must be a string',
            'string.empty': 'Email is required',
            'string.email': 'Email must be valid',
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.base': 'Password must be a string',
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters long',
        }),

    type: Joi.number()
        .valid(0, 1)
        .required()
        .messages({
            'number.base': 'Type must be a number',
            'any.only': 'Type must be 0 (individual) or 1 (team)',
            'any.required': 'Team type is required',
        }),

    members: Joi.array()
        .items(Joi.string())
        .messages({
            'array.base': 'Members must be an array of strings',
        }),

    teamCount: Joi.number()
        .default(1)
        .messages({
            'number.base': 'Team count must be a number',
        })
});


export const loginSchema=Joi.object({
    email: Joi.string()
        .trim()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.base': 'Email must be a string',
            'string.empty': 'Email is required',
            'string.email': 'Email must be valid',
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.base': 'Password must be a string',
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters long',
        }),

});
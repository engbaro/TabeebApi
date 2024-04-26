import Joi from 'joi';

const createSchema = Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
    
        birthYear: Joi.number()
            .integer()
            .min(1900)
            .max(2013),
    
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        name: Joi.string().required(),
        phone: Joi.number().required(),
        creditCard: Joi.string().creditCard(),
        address: Joi.string().required(),
        paymentMethod: Joi.string().required().valid('cash', 'card'),
        gender: Joi.string().required().valid('female', 'male'),
        id: Joi.string().required()
    });
    
const updateSchema = Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30),
    
        birthYear: Joi.number()
            .integer()
            .min(1900)
            .max(2013),
    
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        phone: Joi.string(),
        creditCard: Joi.string().creditCard(),
        name: Joi.string(),
        address: Joi.string(),
        paymentMethod: Joi.string().valid('cash', 'card'),
        gender: Joi.string().valid('female', 'male'),
        id: Joi.string()
    });
export {createSchema, updateSchema}
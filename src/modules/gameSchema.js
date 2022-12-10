import joi from 'joi';

export const gameSchema = joi.object({
    name: joi.string().min(1).required(),
    image: joi.string().uri().required(),
    stockTotal: joi.number().greater(0).required(),
    categoryId: joi.number().required(),
    pricePerDay: joi.number().greater(0).required()
})
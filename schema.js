const Joi = require('joi');
const DEFAULT_IMAGE_URL = "https://plus.unsplash.com/premium_photo-1724818361335-291394c25925?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

module.exports.listingSchema = Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        
            //url: Joi.string().uri().allow(null,"").default("https://plus.unsplash.com/premium_photo-1724818361335-291394c25925?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
        image: Joi.object({
        url: Joi.string()
            .uri()
            .empty('', null)
            .default(DEFAULT_IMAGE_URL)
            .optional()
        }).optional()
    }).required()
});


module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating:Joi.number().min(1).max(5).required(),
        comment:Joi.string().required(),
    }).required()
})
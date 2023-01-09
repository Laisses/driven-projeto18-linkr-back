import joi from "joi";

export const signInJOI = joi.object({
    email: joi.string().email().required().min(1),
    password: joi.string().required().min(1),
})

export const signUpJOI = joi.object({
    email: joi.string().email().required().min(1),
    password: joi.string().required().min(1),
    username: joi.string().required().min(1),
    pictureUrl: joi.string().uri().required()
})
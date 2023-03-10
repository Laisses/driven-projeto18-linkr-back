import joi from "joi";

export const validator = (schema, payload) =>
    schema.validate(payload, { abortEarly: false });

export const post = joi.object({
    link: joi.string().uri().required(),
    description: joi.string().allow(""),
});

export const newDescription = joi.object({
    post_id: joi.number().required(),
    description: joi.string().allow(""),
});


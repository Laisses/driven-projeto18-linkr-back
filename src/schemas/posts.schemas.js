import joi from "joi";

export const validator = (schema, payload) =>
    schema.validate(payload, { abortEarly: false });

export const post = joi.object({
    link: joi.string().uri().required(),
    description: joi.string().allow(""),
});


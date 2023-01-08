import { validator } from "../schemas/posts.schemas.js";
import * as r from "../repositories/posts.repositories.js";

export const asyncError = handlerFn => async (req, res, next) => {
    try {
        await handlerFn(req, res, next);
    } catch (err) {
        console.warn(err);
        res.status(500).send({
            message: "Internal Server Error"
        });
    }
};

export const validate = schema => (req, res, next) => {
    const payload = req.body;
    const { error } = validator(schema, payload);

    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(422).send({
            message: "Unprocessable Entity",
            errors,
        });
    }

    next();
};

export const validatePostEdit = async (req, res, next) => {
    const token = req.token;
    const { post_id } = req.body;

    const post = await r.getPost(Number(post_id));
    const postDb = post.rows[0];

    if (!postDb) {
        return res.sendStatus(404);
    }

    const user = await r.getUser(token);
    const userDb = user.rows[0];

    if (!userDb) {
        return res.sendStatus(401);
    }

    if (userDb.user_id !== postDb.user_id) {
        return res.sendStatus(403);
    }

    next();
};
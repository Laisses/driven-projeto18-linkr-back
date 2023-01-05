import * as r from "../repositories/posts.repositories.js";

export const readPosts = async (req, res) => {
    const posts = await r.getAllPosts();
    console.log(posts.rows);

    res.sendStatus(200);
};
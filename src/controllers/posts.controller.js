import * as r from "../repositories/posts.repositories.js";
import getMetaData from "metadata-scraper";

export const readPosts = async (req, res) => {
    const posts = await r.getAllPosts();
    console.log(posts.rows);

    res.sendStatus(200);
};

export const postLink = async (req, res) => {
    const token = req.token;
    const {description, link} = req.body;

    const user_id = (await r.getUser(token)).rows[0].user_id;
    const post_id = (await r.addNewPost(user_id, description)).rows[0].id;
    const data = await getMetaData(link);

    console.log(data);

    res.sendStatus(200);
};
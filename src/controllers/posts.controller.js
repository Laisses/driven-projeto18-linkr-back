import * as r from "../repositories/posts.repositories.js";
import getMetaData from "metadata-scraper";

const formatPosts = posts => {
    return posts.map(p => {
        return {
            id: p.post_id,
            description: p.description,
            user: {
                id: p.user_id,
                name: p.name,
                photo: p.photo,
            },
            link: {
                title: p.title,
                hint: p.hint,
                image: p.image,
                address: p.address,
            },
        };
    });
};

export const readPosts = async (req, res) => {
    const posts = (await r.getAllPosts()).rows;
    const formattedPosts = formatPosts(posts);

    res.status(200).send(formattedPosts);
};

const scrapeMetadata = async link => {
    try {
        const metadata = await getMetaData(link);
        return {
            title: metadata?.title,
            hint: metadata?.description,
            address: link,
            image: metadata?.image || metadata?.icon
        }
    } catch (err) {
        return {
            title: null,
            hint: null,
            address: link,
            image: null
        };
    }
};

export const postLink = async (req, res) => {
    const token = req.token;
    const {description, link} = req.body;

    const user_id = (await r.getUser(token)).rows[0].user_id;
    const post_id = (await r.addNewPost(user_id, description)).rows[0].id;
    const data = await scrapeMetadata(link);

    await r.addNewLink(post_id, data.title, data.hint, data.address, data.image);

    res.status(201).send({post_id});
};
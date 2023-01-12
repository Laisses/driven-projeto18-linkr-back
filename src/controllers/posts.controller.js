import * as r from "../repositories/posts.repositories.js";
import getMetaData from "metadata-scraper";

const json_agg_empty = arr =>
    Object.keys(arr[0]).length === 0 ? [] : arr;

const formatPost = (p, isRepost) => ({
    id: p.post_id,
    description: p.description,
    created_at: p.created_at,
    likes: json_agg_empty(p.posts_likes),
    reposts: json_agg_empty(p.reposts),
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
    isRepost,
});

export const formatPosts = posts => {
    const postsNestedArray = posts.map(p => {
        const post = formatPost(p, false);
        const reposts = json_agg_empty(p.reposts).map(repost => ({
            ...formatPost(repost, true),
            repostedBy: repost.user_name,
        }));
        return [post].concat(reposts);
    });
    return [].concat(...postsNestedArray);
};

export const readPosts = async (req, res) => {
    const { timestamp } = req.query;
    const posts = (await r.getAllPosts(timestamp || -Infinity)).rows;
    const formattedPosts = formatPosts(posts);
    console.log(formattedPosts)

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
    const { description, link } = req.body;

    const user_id = (await r.getUser(token)).rows[0].user_id;
    const post_id = (await r.addNewPost(user_id, description)).rows[0].id;
    const data = await scrapeMetadata(link);

    await r.addNewLink(post_id, data.title, data.hint, data.address, data.image);

    res.status(201).send({post_id});
};

export const editDescription = async (req, res) => {
    const { post_id, description } = req.body;

    await r.editDescription(post_id, description);

    res.sendStatus(200);
};
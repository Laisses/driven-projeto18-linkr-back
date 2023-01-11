import * as r from "../repositories/posts.repositories.js";
import getMetaData from "metadata-scraper";

export const formatPosts = posts => {
    const allPosts = [];
    posts.forEach(p => {
            allPosts.push({
                id: p.post_id,
                description: p.description,
                likes: Object.keys(p.posts_likes[0]).length ? p.posts_likes : [],
                reposts: Object.keys(p.reposts[0]).length ? p.reposts : [],
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
                isRepost: false
            });
            Object.keys(p.reposts[0]).length ? 
            p.reposts.forEach(repost => {
                allPosts.push({
                    id: p.post_id,
                    description: p.description,
                    likes: Object.keys(p.posts_likes[0]).length ? p.posts_likes : [],
                    reposts: Object.keys(p.reposts[0]).length ? p.reposts : [],
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
                    isRepost: true,
                    repostedBy: repost.user_name
                })
            })
            :
            null
    });
    return allPosts;
};

export const readPosts = async (_req, res) => {
    const posts = (await r.getAllPosts()).rows;
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
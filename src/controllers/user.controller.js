import * as r from "../repositories/user.repositories.js"
import { v4 as uuidV4 } from "uuid";
import bcrypt from "bcrypt";

export async function signIn(req, res) {
    const { email, password } = req.body;
    const token = uuidV4();

    if ( !email || !password ) {
        return res.sendStatus(400)
    }

    try {
        const user = (await r.getUserByEmail(email)).rows[0];
        if (!user) {
            return res.sendStatus(401);
        }

        const encrypted = bcrypt.compareSync(password, user.password);
        if (!encrypted) {
            return res.sendStatus(401);
        }

        const userId = user.id;

        await r.postSession(token, userId);

        res.send({ token, user:{id:user.id, name:user.name, photo:user.photo} });
        
    } catch (err) {
        console.log(err.message)
        res.status(500).send(err.message);
    }
}

export async function signUp(req, res) {

    const { email, password, username, pictureUrl } = req.body

    const hashPassword = bcrypt.hashSync(password, 5);

    if (!username || !email || !password || !pictureUrl) {
        return res.sendStatus(400)
    }

    try {
        await r.postUser(email, hashPassword, username, pictureUrl);
        res.sendStatus(201);

    } catch (err) {

        console.log(err);
        res.sendStatus(500);
    }

}

export async function logout(req, res){
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    try {
        const openedSession = await r.getSessionByToken(token);

        if (!openedSession.rows[0]) {
            return res.sendStatus(401);
        };      

        await r.deleteSessionByToken(token);
        res.sendStatus(204);

    } catch (err) {
        res.sendStatus(500);
    };
}

import { getUser } from "../repositories/posts.repositories.js";

const json_agg_empty = arr => {
    return (!arr || arr.length === 0)
    ? []
    : Object.keys(arr[0]).length === 0 ? [] : arr;
}

const formatPost = (p, isRepost) => ({
    id: p.post_id,
    description: p.description,
    created_at: p.created_at,
    likes: json_agg_empty(p.posts_likes),
    reposts: json_agg_empty(p.reposts),
    comments: json_agg_empty(p.comments),
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

export async function readUserPosts(req, res) {
    const id = req.params.id

    const { timestamp } = req.query;

    const posts = (await r.getPostsByUserId(timestamp || -Infinity, id)).rows;

    const likeRepostComment = posts.map( async (p) => {
        const likes = await r.likes(p.post_id)
        const reposts = await r.reposts(p.post_id)
        const comments = await r.comments(p.post_id)

        return{
            ...p,
            ...likes.rows[0],
            ...reposts.rows[0],
            ...comments.rows[0]
        }
    })
    
    const formattedPosts = r.formatPosts(await Promise.all(likeRepostComment));

    res.status(200).send(formattedPosts);
}

export async function getUsers(req, res) {
    const name = `${req.params.name}%`

    try {
        const users = await r.getUsersByName(name);
        res.status(200).send(users.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getFollowingUsers(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");


    try {
        const id = (await getUser(token)).rows[0].user_id
        const followedUsers = (await r.getFollowingUsersByUserId(id)).rows
        const followedIds = followedUsers.map((f) => {
            
            return f.followed
        })

        res.send(followedIds)

    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function followUser(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    const followedId = req.params.id
    
    try {
        const followerId = (await r.getUser(token)).rows[0].user_id
        await r.followUserById(followerId, followedId)
        
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function unfollowUser(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    const followedId = req.params.id    
    try {
        const followerId = (await r.getUser(token)).rows[0].user_id
        await r.unfollowUserById(followerId, followedId)
        
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getUserData(req, res) {
    const { id } = req.params

    try {
        const userData = (await r.getUserDataById(id)).rows[0]
        res.send(userData)
    } catch (err) {
        console.log(err.message)
    }
}
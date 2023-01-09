import { getUsersByName, postSession, getUserByEmail, postUser, getSessionByToken, deleteSessionByToken } from "../repositories/user.repositories.js"
import { v4 as uuidV4 } from "uuid";
import bcrypt from "bcrypt";
export async function signIn(req, res) {

    const { email, password } = req.body;
    const token = uuidV4();

    if ( !email || !password ) {
        return res.sendStatus(400)
    }

    try {
        const user = (await getUserByEmail(email)).rows[0];
        if (!user) {
            return res.sendStatus(401);
        }

        const encrypted = bcrypt.compareSync(password, user.password);
        if (!encrypted) {
            return res.sendStatus(401);
        }

        const userId = user.id;

        await postSession(token, userId);

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
        await postUser(email, hashPassword, username, pictureUrl);
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
        const openedSession = await getSessionByToken(token);

        if (!openedSession.rows[0]) {
            return res.sendStatus(401);
        };      

        await deleteSessionByToken(token);
        res.sendStatus(204);

    } catch (err) {
        res.sendStatus(500);
    };
}

import { getPostsByUserId } from "../repositories/user.repositories.js";
import { formatPosts } from "./posts.controller.js";

export async function readUserPosts(req, res) {
    const id = req.params.id
    try {   
        const posts = (await getPostsByUserId(id)).rows
        const formattedPosts = formatPosts(posts)

        res.send(formattedPosts)
    } catch (err) {
        res.status(500).send(err.message)
    }
    

}

export async function getUsers(req, res) {
    const name = `${req.params.name}%`

    try {
        const users = await getUsersByName(name);
        res.status(200).send(users.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}


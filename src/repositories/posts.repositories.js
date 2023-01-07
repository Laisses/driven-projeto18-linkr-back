import { connectionDB } from "../database/db.js";

export const getAllPosts = async () => {
    return connectionDB.query(`
        SELECT
            u.id as user_id
            u.name,
            u.photo,
            p.id as post_id,
            p.likes,
            p.description,
            l.title,
            l.hint,
            l.image,
            l.address
        FROM
            users as u
        JOIN
            posts as p
        ON
            u.id = p.user_id
        JOIN
            links as l
        ON
            p.id = l.post_id
        ORDER BY
            p.created_at DESC
        LIMIT
            20
    ;`);
};

export const getUser = async token => {
    return connectionDB.query(`SELECT user_id FROM sessions WHERE token=$1;`, [token]);
};

export const addNewPost = async (user_id, description) => {
    return connectionDB.query(`
        INSERT INTO
            posts (user_id, likes, description)
            VALUES ($1, $2, $3)
        RETURNING id;`,
    [user_id, 0, description]);
};

export const addNewLink = async (post_id, title, hint, address, image ) => {
    return connectionDB.query(`
        INSERT INTO
            links (post_id, title, hint, address, image)
            VALUES ($1, $2, $3, $4, $5);`,
    [post_id, title, hint, address, image]);
};

export const getPost = async id => {
    return await connectionDB.query(`SELECT * FROM posts WHERE id=$1;`, [id]);
};

export const editDescription = async (post_id, description) => {
    return await connectionDB.query(`UPDATE posts SET description=$1 WHERE id=$2;`, [description, post_id]);
};
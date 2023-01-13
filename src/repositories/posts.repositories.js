import { connectionDB } from "../database/db.js";

export const likes = async (postId) => {
    return connectionDB.query(`
        SELECT
            COALESCE(json_agg(json_strip_nulls(json_build_object('user_id', pl.user_id, 'user_name', u.name, 'user_photo', u.photo))), json_build_array()) AS "posts_likes"
        FROM
            users AS u 
        LEFT JOIN
            posts_likes as pl
        ON 
            pl.post_id = $1
        WHERE
            u.id = pl.user_id;
    `, [postId]);
};

export const reposts = async (postId) => {
    return connectionDB.query(`
        SELECT
            COALESCE(json_agg(json_strip_nulls(json_build_object('user_id', rp.user_id, 'user_name', u.name ))), json_build_array()) AS "reposts"
        FROM
            users AS u 
        LEFT JOIN
            reposts as rp
        ON 
            rp.post_id = $1
        WHERE
            u.id = rp.user_id;
    `, [postId]);
};

export const comments = async (postId) => {
    return connectionDB.query(`
        SELECT
            COALESCE(json_agg(json_strip_nulls(json_build_object('comment', c.comment, 'time', c.created_at, 'user_id', u.id, 'user_photo', u.photo, 'user_name', u.name))), json_build_array()) AS "comments"
        FROM
            users AS u 
        LEFT JOIN 
            comments as c 
        ON 
            c.post_id = $1
        WHERE
            u.id = c.user_id;
    `, [postId]);
};

export const getAllPosts = async (after = -Infinity) => {
    return connectionDB.query(`
        SELECT
            u.id as user_id,
            u.name,
            u.photo,
            p.id as post_id,
            p.likes,
            p.description,
            l.title,
            l.hint,
            l.image,
            l.address,
            p.created_at
        FROM
            posts as p
        JOIN
            users as u
        ON
            u.id = p.user_id
        LEFT JOIN
            links as l
        ON
            l.post_id = p.id
        WHERE
            p.created_at >= $1
        GROUP BY 
            p.id,
            u.id,
            l.title,
            l.hint,
            l.image,
            l.address
        ORDER BY
            p.created_at DESC;
    `, [after]);
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
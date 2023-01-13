import { connectionDB } from "../database/db.js"

export async function getUserByEmail(email) {
    return connectionDB.query(`SELECT * FROM users WHERE email=$1;`, [email]);
}

export function getUsersByName(name) {
    return connectionDB.query(
        "SELECT name, photo, id FROM users WHERE name ILIKE $1;",
        [name]
    );
}

export function postSession(token, userId) {
    return connectionDB.query(`INSERT INTO sessions ("token", "user_id") VALUES ($1, $2);`, [token, userId]);
}

export function postUser(email, hashPassword, username, pictureUrl) {
    return connectionDB.query(`INSERT INTO users ("email", "password", "name", "photo") VALUES ($1, $2, $3, $4);`, [email, hashPassword, username, pictureUrl]);
}

export async function getSessionByToken(token) {
    return connectionDB.query(`SELECT * FROM sessions WHERE token=$1;`, [token]);
}

export async function deleteSessionByToken(token) {
    return connectionDB.query(`DELETE FROM sessions WHERE token=$1;`, [token]);
}

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

export const getPostsByUserId = async (after = -Infinity, user_id) => {
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
        AND
            p.user_id = $2
        GROUP BY 
            p.id,
            u.id,
            l.title,
            l.hint,
            l.image,
            l.address
        ORDER BY
            p.created_at DESC;
    `, [after, user_id]);
};

export function followUserById(followerId, followedId) {
    return connectionDB.query(`
        INSERT INTO
            follows (follower, followed)
        VALUES
            ($1, $2)
        ;        
    `, [followerId,followedId])
}

export function unfollowUserById(followerId, followedId) {
    return connectionDB.query(`
        DELETE FROM 
            follows 
        WHERE
            follower = $1
        AND 
            followed = $2
    `, [followerId, followedId])
}

export function getFollowingUsersByUserId(id) {
    return connectionDB.query(`
        SELECT 
            followed
        FROM
            follows
        WHERE
            follower = $1;
    `,[id])
}

export function getUserDataById(id) {
    return connectionDB.query(`
        SELECT
            name,
            photo
        FROM 
            users
        WHERE
            id = $1;
    `,[id])
}
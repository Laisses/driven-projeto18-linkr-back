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

export const getPostsByUserId = async (user_id) => {
    return connectionDB.query(`
        SELECT
            u.name,
            u.photo,
            p.user_id,
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
        WHERE
            p.user_id=$1
        ORDER BY
            p.created_at DESC
        LIMIT
            20
    ;`,
    [user_id]);
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
import { connectionDB } from "../database/db.js";

export async function getTrendingList () {
    return connectionDB.query(`
        SELECT 
            h.name, COUNT(p.hashtag_id) 
        AS 
            times_used 
        FROM 
            posts_hashtags 
        AS 
            p 
        JOIN 
            hashtags 
        AS 
            h 
        ON 
            h.id = p.hashtag_id 
        WHERE 
            p.hashtag_id = h.id 
        GROUP BY 
            h.name 
        ORDER BY 
            times_used DESC 
        LIMIT 
            10;`);
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

export const getHashtagFeed = async (after = -Infinity, hashtag) => {
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
    JOIN
        posts_hashtags as ph
    ON
        p.id = ph.post_id
    JOIN
        hashtags as h
    ON
        ph.hashtag_id = h.id
    WHERE
        p.created_at >= $1
    AND
        h.name = $2
    GROUP BY 
        p.id,
        u.id,
        l.title,
        l.hint,
        l.image,
        l.address
    ORDER BY
        p.created_at DESC
    ;`,
    [after, hashtag]);
};

export async function postHashtag (name) {
    return connectionDB.query(`INSERT INTO hashtags (name) VALUES ($1) RETURNING id;`, [name]);
}

export async function addHashtagVerification (name) {
    return connectionDB.query(`SELECT * FROM hashtags WHERE name = $1;`, [name]);
}

export async function addOnPostsHashtags (post_id, hashtag_id) {
    return connectionDB.query(`INSERT INTO posts_hashtags (post_id, hashtag_id) VALUES ($1, $2);`, [post_id, hashtag_id]);
}

export async function deletePostsHashtags (postId) {
    return connectionDB.query(`DELETE FROM posts_hashtags WHERE post_id = $1;`, [postId])
}
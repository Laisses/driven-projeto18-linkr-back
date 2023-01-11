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

export const getHashtagFeed = async (hashtag) => {
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
            json_agg(json_strip_nulls(json_build_object('user_id', pl.user_id, 'user_name', user_post_like.name, 'user_photo', user_post_like.photo))) AS "posts_likes"
        FROM
            users as u
        JOIN
            posts as p
        LEFT JOIN 
            posts_likes as pl ON p.id = pl.post_id
        ON
            u.id = p.user_id
        JOIN
            links as l
        ON
            p.id = l.post_id
        LEFT JOIN
            users AS user_post_like ON user_post_like.id = pl.user_id
        JOIN
            posts_hashtags as ph
        ON
            p.id = ph.post_id
        JOIN
            hashtags as h
        ON
            ph.hashtag_id = h.id
        WHERE 
            h.name = $1
        GROUP BY 
            p.id, 
            p.user_id, 
            p.likes, 
            p.description,
            u.id,
            l.title,
            l.hint,
            l.image,
            l.address
        ORDER BY
            p.created_at DESC
    ;`,
    [hashtag]);
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
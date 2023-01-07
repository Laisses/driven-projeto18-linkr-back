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
        ORDER BY
            p.created_at DESC
        LIMIT
            20
    ;`),
    [hashtag];
};
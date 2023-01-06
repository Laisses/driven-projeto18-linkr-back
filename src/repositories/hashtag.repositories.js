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

export async function getHashtagFeed (name) {
    return connectionDB.query(`
        SELECT 
            posts.*
        FROM 
            posts 
        JOIN 
            posts_hashtags 
        AS 
            p 
        ON 
            p.post_id = posts.id 
        JOIN 
            hashtags 
        AS 
            h 
        ON 
            h.id = p.hashtag_id 
        WHERE h.name = $1;
        `, [name]);
}
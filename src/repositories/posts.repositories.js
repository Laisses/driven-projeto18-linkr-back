import { connectionDB } from "../database/db.js";

export const getAllPosts = async () => {
    return connectionDB.query(`
        SELECT
            u.name,
            u.photo,
            p.id,
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
            p.created_at ASC
        LIMIT
            20
    ;`);
};


import { connectionDB } from "../database/db.js"

export function getUsersByName(name) {
    return connectionDB.query(
        "SELECT name, photo, id FROM users WHERE name ILIKE $1;",
        [name]
    )
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
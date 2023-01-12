import { connectionDB } from "../database/db.js";

export async function postComment (comment, userId, postId) {
    return connectionDB.query(`INSERT INTO comments (comment, user_id, post_id) VALUES ($1, $2, $3) RETURNING id;`, [comment, userId, postId]);
}
import { connectionDB } from "../database/db.js";

export async function findUser (token) {
    return (
        (await connectionDB.query(
          `SELECT user_id FROM sessions WHERE token = $1`,
          [token]
        )).rows[0].user_id
    )
}

export async function findLike (userId, postId) {
    return (
        (await connectionDB.query(
          `SELECT * FROM posts_likes WHERE user_id = $1 AND post_id = $2`,
          [userId, postId]
        )
      ).rows[0])
}

export async function insertLike (postId, userId) {
    return (
    (await connectionDB.query(
    `INSERT INTO posts_likes (post_id, user_id) VALUES ($1, $2)`,
    [postId, userId]
  ))
    )
}

export async function deleteLike (likeId) {
    return (
        (await connectionDB.query(
        `DELETE FROM posts_likes WHERE id = $1`,
        [likeId.id]
      ))
    )
    }
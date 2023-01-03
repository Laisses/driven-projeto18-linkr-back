import { connectionDB } from "../database/db.js";

export const postLikes = async (req, res) => {
  const token = req.token;

  try {
    const userId = (
      await connectionDB.query(
        `SELECT user_id FROM sessions WHERE token = $1`,
        [token]
      )
    ).rows[0].id;
    const postId = (
      await connectionDB.query(`SELECT id FROM posts WHERE user_id = $1`, [
        userId,
      ])
    ).rows[0].id;

    const verification = (
      await connectionDB.query(
        `SELECT * FROM posts_likes WHERE user_id = $1 AND post_id = $2`,
        [userId, postId]
      )
    ).rows;

    if (!verification) {
      await connectionDB.query(
        `INSERT INTO posts_likes (user_id, post_id) VALUES ($1, $2) `,
        [userId, postId]
      );
    } else {
      await connectionDB.query(
        `DELETE FROM posts_likes WHERE user_id = $1 AND post_id = $2`,
        [userId, postId]
      );
    }
    res.sendStatus(201);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(401);
  }
};

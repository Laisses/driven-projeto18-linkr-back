import { connectionDB } from "../database/db.js";

export const postLikes = async (req, res) => {
  const token = req.token;
  const { id } = req.body;
  const postId = id;

  if(!postId) {
    return sendStatus(404);
  }

  try {
    const userId = (
      await connectionDB.query(
        `SELECT user_id FROM sessions WHERE token = $1`,
        [token]
      )
    ).rows[0].user_id;

    const likeId = (
      await connectionDB.query(
        `SELECT * FROM posts_likes WHERE user_id = $1 AND post_id = $2`,
        [userId, postId]
      )
    ).rows[0];

    {
      !likeId
        ? await connectionDB.query(
            `INSERT INTO posts_likes (post_id, user_id) VALUES ($1, $2) `,
            [postId, userId]
          )
        : await connectionDB.query(
            `DELETE FROM posts_likes WHERE id = $1`,
            [likeId.id]
          );
    }
    res.sendStatus(201);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
};


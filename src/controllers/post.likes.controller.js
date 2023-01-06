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

    const likesValidation = (
      await connectionDB.query(`SELECT likes FROM posts WHERE id = $1`, [
        postId,
      ])
    ).rows[0];
    const likes = !!likesValidation ? likesValidation.likes : 0

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
    const newLikes = !likeId ? likes + 1 : likes -1;
    await connectionDB.query(`UPDATE posts SET likes = $1 WHERE id = $2`, [
      newLikes,
      postId,
    ]);
    res.sendStatus(201);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
};


import { connectionDB } from "../database/db.js";

export const deletePost = async (req, res) => {
  const { id } = req.body;
  const postId = id;
  const token = req.token;

  try {
    const userId = (
      await connectionDB.query(
        `SELECT user_id FROM sessions WHERE token = $1`,
        [token]
      )
    ).rows[0].user_id;
    const userValidation = (
      await connectionDB.query(`SELECT user_id FROM posts WHERE id = $1`, [
        postId,
      ])
    ).rows[0].user_id;
    
    if (userId !== userValidation) {
      return res.sendStatus(401);
    }
    await connectionDB.query(`DELETE FROM posts_hashtags WHERE post_id = $1`, [
      postId,
    ]);
    await connectionDB.query(`DELETE FROM posts WHERE id = $1`, [postId]);
    res.sendStatus(204);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
};

import { connectionDB } from "../database/db.js";

export const getLikes = async (req, res) => {
  const { id } = req.body;
  const postId = id;

  try {
    const likes = (
      await connectionDB.query(`SELECT * FROM posts_likes WHERE post_id = $1`, [
        postId,
      ])
    ).rows;

    const usersId = likes.map((like) => like.user_id);
    console.log(...usersId);

    const users = (
      await connectionDB.query(`SELECT * FROM users WHERE id = ANY($1::int[]);`, [usersId])
    ).rows;
    

    res.status(200).send(users);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
};

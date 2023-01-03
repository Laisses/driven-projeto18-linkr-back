import { connectionDB } from "../database/db.js";

export const getLikes = async (req, res) => {
  const token = req.token;
  try {
    const userId = await connectionDB.query(
      `SELECT user_id FROM sessions WHERE token = $1`,
      [token]
    );
    const likes = await connectionDB.query(
      `SELECT likes FROM posts WHERE user_id = $1`, [userId]
    );
    res.status(200).send(likes)
  } catch (error) {
    console.log(error.message);
    res.sendStatus(401);
  }
};

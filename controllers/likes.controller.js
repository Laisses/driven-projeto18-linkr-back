import { connectionDB } from "../database/db.js";

export const getLikes = async (req, res) => {
  const id = req.params;
  try {
    const likes = await connectionDB.query(
      `SELECT likes FROM posts WHERE id = $1`, [id]
    );
    res.status(200).send(likes)
  } catch (error) {
    console.log(error.message);
    res.sendStatus(401);
  }
};



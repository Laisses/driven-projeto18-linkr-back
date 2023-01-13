import {findUser, findLike, insertLike, deleteLike} from "../repositories/likes.repositories.js"

export const postLikes = async (req, res) => {
  try {
  const token = req.token;
  const { id } = req.body;
  const postId = id;
    
  if(!postId) {
    return sendStatus(404);
  }

    const userId = await findUser(token);

    const likeId = await findLike(userId, postId);

    {
      !likeId
        ? await insertLike(postId, userId)
        : await deleteLike(likeId)
    }
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};


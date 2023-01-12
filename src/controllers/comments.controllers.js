import { postComment } from "../repositories/comments.repositories.js"

export async function postCommentControl (req, res) {
    const { comment, userId, postId } = req.body

    try {
        const commentId = await postComment(comment, userId, postId);
        return res.status(201).send(commentId);
    } catch (error) {
        console.log(error.message);
        return res.sendStatus(500);
    }
}
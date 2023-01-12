import { connectionDB } from "../database/db.js";

export const getAllPosts = async (after = -Infinity) => {
    return connectionDB.query(`
      SELECT
          u.id as user_id,
          u.name,
          u.photo,
          p.id as post_id,
          p.likes,
          p.description,
          l.title,
          l.hint,
          l.image,
          l.address,
          p.created_at,
          json_agg(json_strip_nulls(json_build_object('user_id', pl.user_id, 'user_name', user_post_like.name, 'user_photo', user_post_like.photo))) AS "posts_likes",
          json_agg(json_strip_nulls(json_build_object('user_id', rp.user_id, 'user_name', user_post_share.name ))) AS "reposts",
          json_agg(json_strip_nulls(json_build_object('comment', c.comment, 'time', c.created_at, 'user_id', user_comment.id, 'user_photo', user_comment.photo, 'user_name', user_comment.name))) AS "comments"
      FROM
          users as u
      JOIN
          posts as p
      LEFT JOIN
          posts_likes as pl ON p.id = pl.post_id
      LEFT JOIN 
          reposts as rp ON p.id = rp.post_id
      ON
          u.id = p.user_id
      JOIN
          links as l
      ON
          p.id = l.post_id
      LEFT JOIN
          users AS user_post_like ON user_post_like.id = pl.user_id
      LEFT JOIN
          users AS user_post_share ON user_post_share.id = rp.user_id
      LEFT JOIN 
          comments as c ON c.post_id = p.id
      LEFT JOIN
          users AS user_comment ON user_comment.id = c.user
      WHERE
          p.created_at >= $1
      GROUP BY 
          p.id, 
          p.user_id, 
          p.likes, 
          p.description,
          u.id,
          l.title,
          l.hint,
          l.image,
          l.address
      ORDER BY
          p.created_at DESC;
`, [after]);
};

export const getUser = async token => {
    return connectionDB.query(`SELECT user_id FROM sessions WHERE token=$1;`, [token]);
};

export const addNewPost = async (user_id, description) => {
    return connectionDB.query(`
        INSERT INTO
            posts (user_id, likes, description)
            VALUES ($1, $2, $3)
        RETURNING id;`,
    [user_id, 0, description]);
};

export const addNewLink = async (post_id, title, hint, address, image ) => {
    return connectionDB.query(`
        INSERT INTO
            links (post_id, title, hint, address, image)
            VALUES ($1, $2, $3, $4, $5);`,
    [post_id, title, hint, address, image]);
};

export const getPost = async id => {
    return await connectionDB.query(`SELECT * FROM posts WHERE id=$1;`, [id]);
};

export const editDescription = async (post_id, description) => {
    return await connectionDB.query(`UPDATE posts SET description=$1 WHERE id=$2;`, [description, post_id]);
};
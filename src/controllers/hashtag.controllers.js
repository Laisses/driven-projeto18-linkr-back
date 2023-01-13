import * as r from "../repositories/hashtag.repositories.js"

export async function trendingHashtagsControl (req, res) {
    try {
        const trendingList = await r.getTrendingList()

        if (trendingList.rowCount === 0) {
            return res.sendStatus(404)
          }
      
        return res.status(200).send(trendingList.rows);
    } catch (error) {
        console.log(error.message)
        return res.sendStatus(500)
    }
}

const json_agg_empty = arr => {
    return (!arr || arr.length === 0)
    ? []
    : Object.keys(arr[0]).length === 0 ? [] : arr;
}

const formatPost = (p, isRepost) => ({
    id: p.post_id,
    description: p.description,
    created_at: p.created_at,
    likes: json_agg_empty(p.posts_likes),
    reposts: json_agg_empty(p.reposts),
    comments: json_agg_empty(p.comments),
    user: {
        id: p.user_id,
        name: p.name,
        photo: p.photo,
    },
    link: {
        title: p.title,
        hint: p.hint,
        image: p.image,
        address: p.address,
    },
    isRepost,
});

export const formatPosts = posts => {
    const postsNestedArray = posts.map(p => {
        const post = formatPost(p, false);
        const reposts = json_agg_empty(p.reposts).map(repost => ({
            ...formatPost(repost, true),
            repostedBy: repost.user_name,
        }));
        return [post].concat(reposts);
    });
    return [].concat(...postsNestedArray);
};

export async function feedHashtagControl (req, res) {
    const { hashtag } = req.params

    const { timestamp } = req.query;

    const posts = (await r.getHashtagFeed(timestamp || -Infinity, hashtag)).rows;

    const likeRepostComment = posts.map( async (p) => {
        const likes = await r.likes(p.post_id)
        const reposts = await r.reposts(p.post_id)
        const comments = await r.comments(p.post_id)

        return{
            ...p,
            ...likes.rows[0],
            ...reposts.rows[0],
            ...comments.rows[0]
        }
    })
    
    const formattedPosts = formatPosts(await Promise.all(likeRepostComment));

    res.status(200).send(formattedPosts);
}

export async function addHashtagControl (req, res) {
    const { name, post_id } = req.body

    try {
        const hashtagExist = await r.addHashtagVerification(name)

        if (hashtagExist.rowCount === 0) {
            //caso do hashtag não existir, adiciona apenas na tabela hashtags e posts_hashtags
            const hashtag_id = (await r.postHashtag(name)).rows[0].id
            await r.addOnPostsHashtags(post_id, hashtag_id)

            return res.sendStatus(201)
        } else {
            //caso do hashtag já existir, adiciona apenas na tabela posts_hashtags
            await r.addOnPostsHashtags(post_id, hashtagExist.rows[0].id)
            return res.sendStatus(200)
        }

    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
}

export async function deleteHashtagControl (req, res) {
    const { postId } = req.params

    try {
        //Deleta todas as ocorrências de hashtags nesse post_id
        await r.deletePostsHashtags(postId)
        return res.sendStatus(200)
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
}
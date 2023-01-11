import { postHashtag, addHashtagVerification, getHashtagFeed, getTrendingList, addOnPostsHashtags, deletePostsHashtags } from "../repositories/hashtag.repositories.js"

export async function trendingHashtagsControl (req, res) {
    try {
        const trendingList = await getTrendingList()

        if (trendingList.rowCount === 0) {
            return res.sendStatus(404)
          }
      
        return res.status(200).send(trendingList.rows);
    } catch (error) {
        console.log(error.message)
        return res.sendStatus(500)
    }
}

const formatPosts = posts => {
    return posts.map(p => {
        return {
            id: p.post_id,
            description: p.description,
            likes: Object.keys(p.posts_likes[0]).length ? p.posts_likes : [],
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
        };
    });
};

export async function feedHashtagControl (req, res) {
    const { hashtag } = req.params

    try {
        const feed = await getHashtagFeed(hashtag)

        if (feed.rowCount === 0) {
            return res.sendStatus(404)
        }

        const formattedPosts = formatPosts(feed.rows);

        return res.status(200).send(formattedPosts);
    } catch (error) {
        console.log(error.message)
        return res.sendStatus(500)
    }
}

export async function addHashtagControl (req, res) {
    const { name, post_id } = req.body

    try {
        const hashtagExist = await addHashtagVerification(name)

        if (hashtagExist.rowCount === 0) {
            //caso do hashtag não existir, adiciona apenas na tabela hashtags e posts_hashtags
            const hashtag_id = (await postHashtag(name)).rows[0].id
            await addOnPostsHashtags(post_id, hashtag_id)

            return res.sendStatus(201)
        } else {
            //caso do hashtag já existir, adiciona apenas na tabela posts_hashtags
            await addOnPostsHashtags(post_id, hashtagExist.rows[0].id)
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
        await deletePostsHashtags(postId)
        return res.sendStatus(200)
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
}
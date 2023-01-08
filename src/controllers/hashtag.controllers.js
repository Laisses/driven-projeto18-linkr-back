import { postHashtag, addHashtagVerification, getHashtagFeed, getTrendingList, addOnPostsHashtags } from "../repositories/hashtag.repositories.js"

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

export async function feedHashtagControl (req, res) {
    const { hashtag } = req.params

    try {
        const feed = await getHashtagFeed(hashtag)

        if (feed.rowCount === 0) {
            return res.sendStatus(404)
          }
      
        return res.status(200).send(feed.rows);
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
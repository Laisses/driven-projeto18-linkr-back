import { getHashtagFeed, getTrendingList } from "../repositories/hashtag.repositories.js"

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
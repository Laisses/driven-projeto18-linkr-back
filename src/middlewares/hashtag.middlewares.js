import { connectionDB } from "../database/db.js"

export async function trendingHashtagsMiddle (req, res, next) {
    // Código comentado porque não tem como pegar um token verdadeiro

    // const { authorization } = req.headers
    // const token = authorization?.replace("Bearer ", "")

    // try {
    //     const sessionExist = await connectionDB.query('SELECT * FROM sessions WHERE token = $1;', [token])
    //     if (sessionExist.rowCount === 0) {
    //         return res.sendStatus(401)
    //     }
    // } catch (error) {
    //     console.log(error.message)
    //     return res.sendStatus(500)
    // }

    next ()
}
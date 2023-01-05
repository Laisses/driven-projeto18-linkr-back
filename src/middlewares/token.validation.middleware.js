import { connectionDB } from "../database/db.js";

export const tokenMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;

    const token = authorization?.replace("Bearer ", "");
    
    if (!token) {
        return res.sendStatus(401);
    }
     try {
        const availableTokens = (await connectionDB.query(`SELECT token FROM sessions;`)).rows.map(ta => ta.token)
        if (!availableTokens.includes(`${token}`)) {
            return res.sendStatus(404);
        }
     } catch (error) {
        res.status(500).send(error.message);
     }

    req.token = token
    next()
    }
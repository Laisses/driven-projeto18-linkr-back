import { getUsersByName } from "../repositories/user.repositories.js"

export async function getUsers(req, res) {
    const name = `${req.params.name}%`

    try {
        const users = await getUsersByName(name)
        res.status(200).send(users.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}
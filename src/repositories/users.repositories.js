import { connectionDB } from "../../database/db.js"

export function getUsersByName(name) {
    return connectionDB.query(
        "SELECT name, photo FROM users WHERE name ILIKE $1;",
        [name]
    )
}
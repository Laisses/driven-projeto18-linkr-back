import { connectionDB } from "../database/db.js"

export async function getUserByEmail(email) {
    return connectionDB.query(`SELECT * FROM users WHERE email=$1;`, [email]);
}

export function getUsersByName(name) {
    return connectionDB.query(
        "SELECT name, photo, id FROM users WHERE name ILIKE $1;",
        [name]
    );
}

export function postSession(token, userId) {
    return connectionDB.query(`INSERT INTO sessions ("token", "user_id") VALUES ($1, $2);`, [token, userId]);
}

export function postUser(email, hashPassword, username, pictureUrl) {
    return connectionDB.query(`INSERT INTO users ("email", "password", "name", "photo") VALUES ($1, $2, $3, $4);`, [email, hashPassword, username, pictureUrl]);
}

export async function getSessionByToken(token) {
    return connectionDB.query(`SELECT * FROM sessions WHERE token=$1;`, [token]);
}

export async function deleteSessionByToken(token) {
    return connectionDB.query(`DELETE FROM sessions WHERE token=$1;`, [token]);
}
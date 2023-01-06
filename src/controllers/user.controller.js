import joi from "joi";
import {connectionDB} from "../database/db.js";
import { getUsersByName } from "../repositories/user.repositories.js"
import { v4 as uuidV4 } from "uuid";
import bcrypt from "bcrypt";

const signInJOI = joi.object({
    email: joi.string().email().required().min(1),
    password: joi.string().required().min(1),
})

const signUpJOI = joi.object({
    email: joi.string().email().required().min(1),
    password: joi.string().required().min(1),
    username: joi.string().required().min(1),
    pictureUrl: joi.string().uri().required()
})

export async function signIn(req, res) {

    const { email, password } = req.body;
    const token = uuidV4();
    const validation = signInJOI.validate({ email, password }, { abortEarly: false })

    if (validation.error) {
        const erros = validation.error.details.map((d) => d.message)
        res.status(422).send(erros)
        return
    }

    if ( !email || !password ) {
        return res.sendStatus(400)
    }

    try {
        const session = await connectionDB.query(`SELECT * FROM users WHERE email=$1;`, [email])
        if (!session.rows[0]) {
            return res.sendStatus(401);
        }

        const encrypted = bcrypt.compareSync(password, session.rows[0].password);
        if (!encrypted) {
            return res.sendStatus(401);
        }

        const userId = session.rows[0].id.toString();

        await connectionDB.query(`INSERT INTO sessions ("token", "userId") VALUES ($1, $2);`, [token, userId])

        res.send({ token });
        
    } catch (err) {
        console.log(err)
        res.sendStatus(500);
    }
}

export async function signUp(req, res) {

    const { email, password, username, pictureUrl } = req.body
    console.log(req.body)

    const validation = signUpJOI.validate({ username, email, password, pictureUrl}, { abortEarly: false })
    console.log("entrei na funçao")
    if (validation.error) {
        const erros = validation.error.details.map((d) => d.message)
        res.status(422).send(erros)
        return
    }

    const hashPassword = bcrypt.hashSync(password, 5);

    if (!username || !email || !password || !pictureUrl) {
        return res.sendStatus(400)
    }

    try {
        await connectionDB.query(`INSERT INTO users ("email", "password", "name", "photo") VALUES ($1, $2, $3, $4);`, [email, hashPassword, username, pictureUrl])
        res.sendStatus(201);

    } catch (err) {

        console.log(err);
        res.sendStatus(500);
    }

}

export async function logout(req, res){
}

export async function getUsers(req, res) {
    const name = `${req.params.name}%`

    try {
        const users = await getUsersByName(name)
        res.status(200).send(users.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}


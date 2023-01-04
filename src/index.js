import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

import hashtagRouters from "./routes/hashtag.routes.js";

//Configs
app.use(express.json());
app.use(cors());
app.use(hashtagRouters);

const port = process.env.PORT;

app.listen(port, () => console.log(`Está rodando na porta ${port}!`));
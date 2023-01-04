import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { likesRouter } from "../routes/likes.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(likesRouter);

const port = process.env.PORT;

app.listen(port, () => console.log(`Está rodando na porta ${port}!`));

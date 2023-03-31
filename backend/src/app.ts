
import express from 'express';
import { Router, Request, Response } from 'express';
import cors from 'cors';

import http from "http";
import fs from "fs";

import * as dotenv from 'dotenv';
dotenv.config();

import postPrompt from "./routes/prompt"

const app: express.Express = express();
app.use(cors());
app.use(express.json());
const router: Router = Router();

router.post('/prompt', postPrompt);

app.use(router);
app.options('')
const server = http.createServer(app);

server.listen(3000);

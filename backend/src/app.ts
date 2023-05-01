
import express from 'express';
import { Router, Request, Response } from 'express';
import cors from 'cors';

import http from "http";
import fs from "fs";

import * as dotenv from 'dotenv';
const envLoadResult = dotenv.config();
console.log(`Environment: ${JSON.stringify(envLoadResult)}`);

import postPrompt from "./routes/prompt"
import healthcheck from './routes/healthcheck';

const app: express.Express = express();

const corsOptions = {
  origin: '*', // You can set a specific origin if needed
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(express.json());
const router: Router = Router();

router.get('/prompt', postPrompt);
router.get('/healthcheck', healthcheck);

app.use(router);


const server = http.createServer(app);

server.listen(3000);

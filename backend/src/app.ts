
import express from 'express';
import { Router, Request, Response } from 'express';
import cors from 'cors';

import http from "http";
import fs from "fs";

import * as dotenv from 'dotenv';
const envLoadResult = dotenv.config();
console.log(`Environment: ${JSON.stringify(envLoadResult)}`);

import getPromptws from './routes/promptws';
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

router.get('/healthcheck', healthcheck);

app.use(router);


const server = http.createServer(app);

// Set up the WebSocket server for the '/promptws' endpoint
server.on('upgrade', (req, socket, head) => {
  console.log('got an upgrade request' + req.url);
  if (req.url?.startsWith('/promptws')) {
    getPromptws(req, socket, head);
  } else {
    console.log('wrong url destroying');
    socket.destroy();
  }
});

server.listen(3000);

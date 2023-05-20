import express from 'express';
import { Router } from 'express';
import cors from 'cors';

import http from 'http';

import * as dotenv from 'dotenv';
const envLoadResult = dotenv.config();
console.log(`Environment: ${JSON.stringify(envLoadResult)}`);

import getPromptws from './routes/promptws';
import getPromptStreamingWs from './routes/promptstreamingws';
import healthcheck from './routes/healthcheck';

const app: express.Express = express();

const corsOptions = {
  origin: '*', // TODO: Move this over to an env file
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
  } else if (req.url?.startsWith('/promptstreamingws')) {
    getPromptStreamingWs(req, socket, head);
  } else {
    console.log('wrong url destroying');
    socket.destroy();
  }
});

server.listen(3000);

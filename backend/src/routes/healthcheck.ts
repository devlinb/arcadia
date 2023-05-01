import { Request, Response } from 'express';

export default async function healthcheck(req: Request, res: Response) {
  console.log(`healthcheck`);

  res.status(200).send('ok');
  res.end();
}
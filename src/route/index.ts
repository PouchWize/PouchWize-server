import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Welcome to PouchWize API, a peer-to-peer decentralized lending platform');
});

export default router;
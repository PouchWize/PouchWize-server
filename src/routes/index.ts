import { Request, Response, Router } from "express";

import userRoute from "./user.route";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send(
    "Welcome to PouchWize API, a peer-to-peer decentralized lending platform",
  );
});

router.use("/auth", userRoute);

export default router;

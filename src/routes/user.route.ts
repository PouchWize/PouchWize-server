import { Router } from "express";
import { createUser, loginUser, getUser } from "../controllers/user.controller";
import { authenticateUser } from "../middlewares/auth.middleware";


const router = Router();

router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/user/:id", authenticateUser, getUser);

export default router;

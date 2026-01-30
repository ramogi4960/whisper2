import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { getUsers } from "../controllers/userController";

/*
    User Routes will be defined here
    get all users
    post and create new user
*/


const router = Router();

router.get("/", protectRoute, getUsers);

export default router;
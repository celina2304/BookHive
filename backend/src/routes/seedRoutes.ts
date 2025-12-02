import { Router } from "express";


import { checkAccessToken } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { ensureSelf } from "../middlewares/ensureSelf";
import { seedBooks } from "../controllers/seedController";

const router = Router();

// Admin: POST retreived books from other apis to own database
router.post("/", checkAccessToken, authorizeRoles("admin"), seedBooks);

// Admin/User: Get single user by id
// router.get("/:_id", checkAccessToken, authorizeRoles("admin", "user"), ensureSelf, getUserById);


export default router;

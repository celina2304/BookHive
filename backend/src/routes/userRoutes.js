import {
    Router
} from "express";

import {
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    signup,
    login
} from "../controllers/userController.js";
import {
    checkAccessToken
} from "../middlewares/authMiddleware.js";

const router = Router();

// GET 
router.get("/", checkAccessToken, getAllUsers);
router.get("/:_id", checkAccessToken, getUserById);

// POST
router.post("/signup", signup);
router.post("/login", login);

// PUT
router.put("/update-user/:_id", updateUserById);

// DELETE
router.delete("/delete-user/:_id", deleteUserById);

export default router;
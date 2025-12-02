import { Router } from "express";

import {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  register,
  login,
  refresh,
  logout
} from "../controllers/userController";

import { checkAccessToken } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { ensureSelf } from "../middlewares/ensureSelf";

const router = Router();

// Admin: Get all users
router.get("/", checkAccessToken, authorizeRoles("admin"), getAllUsers);

// Admin/User: Get single user by id
router.get("/:_id", checkAccessToken, authorizeRoles("admin", "user"), ensureSelf, getUserById);

// Public: Register
router.post("/register", register);

// Public: Login
router.post("/login", login);

// Public: Refresh token
router.post("/refresh", refresh);

// Public: Logout
router.post("/logout", logout);

// Admin/User: Update user
router.put("/update-user/:_id", checkAccessToken, authorizeRoles("admin", "user"), ensureSelf, updateUserById);

// Admin: Delete user
router.delete("/delete-user/:_id", checkAccessToken, authorizeRoles("admin"), ensureSelf, deleteUserById);

export default router;

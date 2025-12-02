import {
    Router
} from "express";

import {
    addNewAuthor,
    deleteAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthor
} from "../controllers/authorController";
import { checkAccessToken } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// GET all authors -> public
router.get("/", checkAccessToken, getAllAuthors);

// GET author by id -> public
router.get("/:_id", checkAccessToken, getAuthorById);

// Add author -> librarian or admin
router.post("/new-author", checkAccessToken, authorizeRoles("admin", "librarian"), addNewAuthor);

// Update author -> librarian or admin
router.put("/update-author/:_id", checkAccessToken, authorizeRoles("admin", "librarian"), updateAuthor);

// Delete author -> only admin
router.delete("/delete-author/:_id", checkAccessToken, authorizeRoles("admin"), deleteAuthor);


export default router;
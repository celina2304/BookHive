import {
    Router
} from "express";

import {
    addNewPublication,
    deletePublication,
    getAllPublications,
    getPublicationById,
    updatePublication
} from "../controllers/publicationController.js";

const router = Router();

router.get("/", getAllPublications);
router.get("/:_id", getPublicationById)

router.post("/new-publication", addNewPublication);

router.put("/update-publication/:_id", updatePublication);

router.delete("/delete-publication/:_id", deletePublication);

export default router;
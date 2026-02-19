import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import { create, list, getOne, update, remove } from "../controllers/jobs.controller.js";

const router = Router();

router.use(protect);
router.post("/", create);
router.get("/", list);
router.get("/:id", getOne);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;

import { Router } from "express";
import { getEventRubric } from "@/controllers/rubrics";

const router = Router();

router.get("/:id", getEventRubric); // Get a rubric by ID

export default router;

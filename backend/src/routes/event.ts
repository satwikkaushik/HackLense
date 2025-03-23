import { createEvent, getEventById, deleteEvent } from "@/controllers/events";
import { Router } from "express";

const router = Router();

router.post("/", createEvent);

router.get("/:id", getEventById);

router.delete("/:id", deleteEvent);

export default router;
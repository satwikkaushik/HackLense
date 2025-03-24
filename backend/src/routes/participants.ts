import { getParticipants, addParticipants, removeParticipants } from "@/controllers/participants";
import { validateAuthToken } from "@/middlewares/validateAuthToken";
import { Router } from "express";

const router = Router();

router.get("/:eventId", validateAuthToken(), getParticipants);

router.post("/:eventId", addParticipants);

router.delete("/:eventId", removeParticipants);

export default router;
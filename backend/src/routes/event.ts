import { Router } from "express";
import {
  createEvent,
  getEvents,
  getEventTeacherSpecific,
  viewStanding,
  updateEventSubmission,
} from "@/controllers/event";

const router = Router();

router.post("/", createEvent);
router.get("/", getEvents);
router.get("/specific", getEventTeacherSpecific);
router.get("/final-standings/:eventId", viewStanding);
// router.post("/updateSubmission/:id", updateEventSubmission);

export default router;

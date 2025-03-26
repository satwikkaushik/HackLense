import Submission from "@/schema/submissions";
import { Request, Response } from "express";
import { Submission as SubmissionInterface } from "@/types/submission";
import Event from "@/schema/events";
import { updateEventSubmission } from "@/controllers/event";
import { findUserByEmail } from "@/services/dbService";
import multer from "multer";
import path from "path";
import { UserInTransit } from "@/types/user";
import {
  getSubmissionSummaryService,
  submissionExtractDataService,
  evaluateMathsScienceService,
  evaluateCodingService,
  evaluateInnovation,
  evaluateLLMService,
} from "@/services/llmServices";
import { AuthRequest } from "@/shared/interfaces";

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, "../../../userUploads"),
    filename: function (req, file, cb) {
      const uniqueName = `${Date.now()}_${file.originalname}`;
      cb(null, uniqueName);
    },
  }),
}).single("file");

export async function createSubmission(req: AuthRequest, res: Response) {
  upload(req, res, async (err) => {
    if (err) {
      res.status(500).json({ message: "File upload error" });
      return;
    }

    const submission: SubmissionInterface = req.body;
    if (
      !req.file ||
      !submission.event ||
      !submission.fileType ||
      !submission.fileLanguage
    ) {
      res.status(400).json({ message: "Missing Fields" });
      return;
    }

    try {
      // validate event
      const event = await Event.findById(submission.event);
      if (!event) {
        res.status(404).json({ message: "Event not found" });
        return;
      }

      // getting student from cookie
      const userEmail = (req.user)?.email;
      if (!userEmail) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const user = await findUserByEmail(userEmail);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      submission.student = "" + user._id;

      // store fileURL
      submission.fileURL = `${req.file.filename}`;

      const newSubmission = await Submission.create(submission);
      const updatedEvent = await updateEventSubmission(submission.event);
      if (!newSubmission || !updatedEvent) {
        throw new Error("Error in creating submission");
      }

      await submissionExtractDataService(
        "" + newSubmission._id,
        submission.fileURL
      );

      await getSubmissionSummaryService("" + newSubmission._id);

      if (event.subject === "mathematics" || event.subject === "science") {
        await evaluateMathsScienceService("" + newSubmission._id);
      } else if (event.subject === "coding") {
        await evaluateCodingService("" + newSubmission._id);
      } else if (event.subject === "innovation") {
        await evaluateLLMService("" + newSubmission._id);
      }

      return;
    } catch (error) {
      console.log("Error in creating submission:", error);
      res.status(500).json({
        message: "Error in creating submission",
      });
      return;
    }
  });
}

export async function getSubmissions(req: Request, res: Response) {
  try {
    const submissions = await Submission.find({});
    res.status(200).json(submissions);
    return;
  } catch (error) {
    res.status(404).json({ message: "Error in fetching submissions" });
    return;
  }
}

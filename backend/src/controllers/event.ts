import { Request, Response } from "express";
import Event from "@/schema/events";
import { Event as EventInterface } from "@/types/event";
import { findUserByEmail } from "@/services/dbService";
import { UserInTransit } from "@/types/user";
import {
  getEventKeywordsService,
  generateTestCasesService,
} from "@/services/llmServices";
import Submission from "@/schema/submissions";

declare global {
  namespace Express {
    interface Request {
      user?: UserInTransit;
    }
  }
}

export async function createEvent(req: Request, res: Response) {
  const event: EventInterface = req.body;

  if (
    !event.title ||
    !event.description ||
    !event.subject ||
    !event.startDate ||
    !event.endDate ||
    !event.parameters
  ) {
    res.status(400).json({ message: "Missing Fields" });
    return;
  }

  event.topic = event.department;

  event.submissions = 0;

  try {
    // Fetching createdBy from the cookie
    const createdBy = req.user?.email;
    if (!createdBy || createdBy === null) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const user = await findUserByEmail(createdBy);

    if (!user || user === null) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    event.createdBy = user._id;

    const newEvent = await Event.create(event);
    if (!newEvent || newEvent === null) {
      throw new Error("Error in event creation");
    }

    if (newEvent.subject === "innovation") {
      // generating keywords if event is innovation(hackathon type)
      await getEventKeywordsService("" + newEvent._id);
    } else if (newEvent.subject === "coding") {
      // generating test cases if event is coding
      await generateTestCasesService("" + newEvent._id);
    }

    res.status(201).json({ message: "Event created successfully" });
    return;
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error in event creation" });
    return;
  }
}

export async function getEvents(req: Request, res: Response) {
  try {
    const events: EventInterface[] = await Event.find({});
    res.status(200).json(events);
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error in fetching events" });
    return;
  }
}

export async function getEventTeacherSpecific(req: Request, res: Response) {
  try {
    // Fetching createdBy from the cookie
    const createdBy = req.user?.email;
    if (!createdBy || createdBy === null) {
      console.log("User not found");
      res.status(404).json({ message: "User not found" });
      return;
    }

    const user = await findUserByEmail(createdBy);

    if (!user || user === null) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const events: EventInterface[] = await Event.find({
      createdBy: user._id,
    });

    res.status(200).json(events);
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error in fetching events" });
    return;
  }
}

export async function updateEventSubmission(eventId: string): Promise<String> {
  if (!eventId) {
    return Promise.reject("Missing Event Id");
  }

  try {
    const event = await Event.findById(eventId);
    if (!event || event === null) {
      return Promise.reject("Event not found");
    }

    event.submissions += 1;
    await event.save();
    return Promise.resolve("Event submission updated successfully");
  } catch (error) {
    console.error("Error in updating event submission:", error);
    return Promise.reject("Error in updating event submission");
  }
}

async function getFinalStandings(eventId: string) {
  try {
    const event = await Event.findById(eventId);
    if (!eventId) {
      throw new Error("Missing Event Id");
    }

    if (!event) {
      throw new Error("Event not found");
    }

    if (event.submissions === 0) {
      throw new Error("No submissions yet");
    }

    const submissions = await Submission.find({ event: event._id }).populate(
      "student",
      "name finalScore"
    );

    const finalStandings = submissions
      .filter((s: any) => s.submittedAt !== undefined)
      .sort(
        (a: any, b: any) =>
          b.finalScore - a.finalScore ||
          a.submittedAt - b.submittedAt ||
          a._id.toString().localeCompare(b._id.toString()) // Tie-breaker: Random
      );

    return Promise.resolve(finalStandings);
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function viewStanding(req: Request, res: Response) {
  const eventId = req.params.eventId;

  try {
    const finalStandings = await getFinalStandings(eventId);
    const event = await Event.findById(eventId);
    
    const filteredStandings = finalStandings.map((standing: any) => ({
      student: standing.student.name,
      finalScore: standing.finalScore,
      summary: standing.summary,
    }));

    res.status(200).json({ event: event, standings: filteredStandings });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

import Event from "@/schema/events";
import { Request, Response } from "express";
import { Types } from "mongoose";

export const getEventRubric = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid event ID format" });
            return;
        }

        // Fetch only the rubric-related fields from the event
        const event = await Event.findById(id)
            .select("parameters keywords") // Select only rubric-related fields
            .populate("parameters") // Populate parameter details
            .populate("keywords"); // Populate keyword details

        if (!event) {
            res.status(404).json({ error: "Event not found" });
            return;
        }

        res.status(200).json({ parameters: event.parameters, keywords: event.keywords });
    } catch (error) {
        console.error("Error fetching event rubric:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    return;
};

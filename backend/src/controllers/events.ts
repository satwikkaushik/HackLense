import Event from "@/schema/events";
import Keyword from "@/schema/keywords";
import Parameter from "@/schema/parameters";
import User from "@/schema/users";
import { Request, Response } from "express";
import { Types } from "mongoose";

export async function createEvent(req: Request, res: Response): Promise<void> {
    try {
        const { title, description, startDate, endDate, parameters, keywords, createdBy } = req.body;

        // Validate required fields
        if (!title || !startDate || !endDate || !parameters || !keywords || !createdBy) {
            res.status(400).json({ error: "Title, startDate, endDate, parameters, keywords, and createdBy are required" });
            return;
        }

        // Validate createdBy (User must exist)
        const user = await User.findById(createdBy);
        if (!user) {
            res.status(404).json({ error: "CreatedBy user not found" });
            return;
        }

        // Create Parameters
        let parameterIds: Types.ObjectId[] = [];
        if (Array.isArray(parameters) && parameters.length > 0) {
            const createdParams = await Parameter.insertMany(
                parameters.map(param => ({
                    name: param.name,
                    description: param.description,
                    weight: param.weight,
                    status: param.status || "active",
                    createdBy: user._id
                }))
            );
            parameterIds = createdParams.map(param => param._id);
        }

        // Create Keywords
        let keywordIds: Types.ObjectId[] = [];
        if (Array.isArray(keywords) && keywords.length > 0) {
            const createdKeywords = await Keyword.insertMany(
                keywords.map(keyword => ({
                    name: keyword.name,
                    weight: keyword.weight,
                    category: keyword.category,
                    createdBy: user._id
                }))
            );
            keywordIds = createdKeywords.map(keyword => keyword._id);
        }

        // Create and Save the Event
        const newEvent = new Event({
            title,
            description,
            startDate,
            endDate,
            parameters: parameterIds,
            keywords: keywordIds,
            createdBy: user._id,
            participants: [],
            submissions: []
        });

        const savedEvent = await newEvent.save();
        res.status(201).json({ message: "Event created successfully", event: savedEvent });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getEventById(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid event ID format" });
            return;
        }

        // Fetch the event and populate related fields
        const event = await Event.findById(id)
            .populate("parameters") // Populate parameter details
            .populate("keywords") // Populate keyword details
            .populate("createdBy", "username email") // Populate creator details
            .populate("participants", "username email") // Populate participants
            .populate("submissions"); // Populate submissions

        if (!event) {
            res.status(404).json({ error: "Event not found" });
            return;
        }

        res.status(200).json(event);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function deleteEvent(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;

        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid event ID format" });
            return;
        }

        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            res.status(404).json({ error: "Event not found" });
            return;
        }

        res.status(200).json({ message: "Event deleted successfully", event: deletedEvent });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

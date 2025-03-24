import { Request, Response } from "express";
import Event from "@/schema/events";
import User from "@/schema/users";

export async function getParticipants(req: Request, res: Response): Promise<void> {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId).populate("participants", "_id name email").lean();
        if (!event) {
            res.status(404).json({ error: `Event with ID ${eventId} not found` });
            return;
        }

        res.status(200).json({ participants: event.participants || [] });
    } catch (error) {
        console.error("Error fetching participants:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function addParticipants(req: Request, res: Response): Promise<void> {
    try {
        const { eventId } = req.params;
        const { participants } = req.body; // Expected to be an array of emails

        if (!participants || !Array.isArray(participants) || participants.length === 0) {
            res.status(400).json({ error: "No participants provided" });
            return;
        }

        // Find event
        const event = await Event.findById(eventId);
        if (!event) {
            res.status(404).json({ error: `Event with ID ${eventId} not found` });
            return;
        }

        // Find users by email
        const users = await User.find({ email: { $in: participants } }, "_id name email");
        if (users.length === 0) {
            res.status(404).json({ error: "No matching users found" });
            return;
        }

        const existingParticipantIds = new Set((event.participants || []).map(p => p._id.toString()));

        // Filter out users who are already participants
        const newParticipants = users.filter(user => !existingParticipantIds.has(user._id.toString()));

        if (newParticipants.length === 0) {
            res.status(400).json({ error: "All users are already participants" });
            return;
        }

        const newParticipantIds = newParticipants.map(user => user._id);

        // Add new participants and save event
        event.participants.push(...newParticipantIds);
        await event.save();

        res.status(200).json({
            message: "Participants added successfully",
            participants: newParticipantIds.map(p => p.toString())
        });
    } catch (error) {
        console.error("Error adding participants:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function removeParticipants(req: Request, res: Response): Promise<void> {
    try {
        const { eventId } = req.params;
        const { participants } = req.body; // Expected to be an array of user IDs

        if (!participants || !Array.isArray(participants) || participants.length === 0) {
            res.status(400).json({ error: "No participants provided" });
            return;
        }

        // Find event
        const event = await Event.findById(eventId);
        if (!event) {
            res.status(404).json({ error: `Event with ID ${eventId} not found` });
            return;
        }

        if (!event.participants?.length) {
            res.status(400).json({ error: "No participants in this event" });
            return;
        }

        const participantIdsToRemove = new Set(participants.map(id => id.toString()));
        event.participants = event.participants.filter(p => !participantIdsToRemove.has(p.toString()));
        await event.save();

        res.status(200).json({ message: "Participants removed successfully" });
    } catch (error) {
        console.error("Error removing participants:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
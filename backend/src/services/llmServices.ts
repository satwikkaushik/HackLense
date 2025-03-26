import Submission from "@/schema/submissions";
import Event from "@/schema/events";
import axios from "axios";

const FLASK_API = "http://localhost:3001";

export async function getSubmissionSummaryService(
  submissionId: string
): Promise<String> {
  try {
    // fetch submission
    const submission = await Submission.findById(submissionId);
    if (!submission || submission === null) {
      return Promise.reject("Submission not found");
    }

    // fetch event corresponding to this solution
    const event = await Event.findById(submission.event);
    if (!event || event === null) {
      return Promise.reject("Event not found");
    }

    interface SummaryResponse {
      summary: string;
    }

    const response = await axios.post<SummaryResponse>(
      `${FLASK_API}/generate/summary`,
      {
        solution: submission.extractedContent,
        problem_statement: event.description,
      }
    );

    if (response.data && response.data.summary) {
      submission.summary = response.data.summary;
      await submission.save();

      return Promise.resolve("Summary generated successfully");
    } else {
      throw new Error("Error in generating summary");
    }
  } catch (error) {
    console.error("Error generating keywords:", error);
    return Promise.reject("Error in generating summary");
  }
}

export async function getEventKeywordsService(eventId: string) {
  try {
    // fetch event corresponding to this solution
    const event = await Event.findById(eventId);
    if (!event || event === null) {
      return Promise.reject("Event not found");
    }

    interface KeywordsResponse {
      keywords: string[];
    }

    const response = await axios.post<KeywordsResponse>(
      `${FLASK_API}/generate/keywords`,
      {
        problem_statement: event.description,
      }
    );

    if (response.data && Array.isArray(response.data.keywords)) {
      event.keywords = response.data.keywords;
      await event.save();
      return Promise.resolve("Keywords generated successfully");
    } else {
      throw new Error("Error in generating keywords");
    }
  } catch (error) {
    console.error("Error generating keywords:", error);
    return Promise.reject("Error in generating keywords");
  }
}

export async function generateTestCasesService(eventId: string) {
  try {
    // fetch event corresponding to this solution
    const event = await Event.findById(eventId);
    if (!event || event === null) {
      return Promise.reject("Event not found");
    }

    interface KeywordsResponse {
      testCases: string;
    }

    const response = await axios.post<KeywordsResponse>(
      `${FLASK_API}/generate/testCases`,
      {
        problem_statement: event.description,
      }
    );

    if (response.data && response.data.testCases) {
      // Extract JSON from the string
      const jsonMatch = response.data.testCases.match(
        /```json\n([\s\S]*?)\n```/
      );

      if (jsonMatch && jsonMatch[1]) {
        const parsedTestCases = JSON.parse(jsonMatch[1]); // Parse the JSON string
        event.testCases = parsedTestCases;
        await event.save();
        return Promise.resolve("Test Cases generated successfully");
      } else {
        throw new Error("Error parsing test cases JSON");
      }
    } else {
      throw new Error("Error in generating Test Cases");
    }
  } catch (error) {
    console.error("Error generating Test Cases:", error);
    return Promise.reject("Error in generating Test Cases");
  }
}

export async function submissionExtractDataService(
  submissionId: string,
  fileURL: string
) {
  try {
    const response = await axios.post<{ text?: string }>(
      `${FLASK_API}/extract`,
      {
        fileURI: fileURL,
      }
    );

    if (response.status === 200 && response.data !== null) {
      const submission = await Submission.findById(submissionId);
      if (!submission || submission === null) {
        console.log("Submission not found");
        return Promise.reject("Submission not found");
      }

      submission.extractedContent = response.data.text || "";
      await submission.save();
      return Promise.resolve("Data extracted successfully");
    }
  } catch (error) {
    console.log("Error in extracting data:", error);
    return Promise.reject("Error in extracting data");
  }
}

export async function evaluateMathsScienceService(submissionId: string) {
  try {
    // fetch submission
    const submission = await Submission.findById(submissionId);
    if (!submission || submission === null) {
      return Promise.reject("Submission not found");
    }

    // fetch event corresponding to this solution
    const event = await Event.findById(submission.event);
    if (!event || event === null) {
      return Promise.reject("Event not found");
    }

    interface SummaryResponse {
      score: number;
    }

    const response = await axios.post<SummaryResponse>(
      `${FLASK_API}/evaluate/ms`,
      {
        topic: event.topic,
        solution: submission.extractedContent,
        problem_statement: event.description,
      }
    );

    if (response.data && response.data.score) {
      submission.finalScore = response.data.score;
      await submission.save();

      return Promise.resolve("Maths Science Solution evaluated successfully");
    } else {
      throw new Error("Error in evaluating Maths Science Solution");
    }
  } catch (error) {
    console.error("Error in evaluating Maths Science Solution:", error);
    return Promise.reject("Error in evaluating Maths Science Solution");
  }
}

export async function evaluateCodingService(submissionId: string) {
  try {
    // fetch submission
    const submission = await Submission.findById(submissionId);
    if (!submission || submission === null) {
      return Promise.reject("Submission not found");
    }

    // fetch event corresponding to this solution
    const event = await Event.findById(submission.event);
    if (!event || event === null) {
      return Promise.reject("Event not found");
    }

    interface SummaryResponse {
      score: number;
    }

    const response = await axios.post<SummaryResponse>(
      `${FLASK_API}/evaluate/code`,
      {
        solution: submission.extractedContent,
        testCases: event.testCases,
      }
    );

    if (response.data && response.data.score) {
      submission.finalScore = response.data.score;
      await submission.save();

      return Promise.resolve("Coding Solution evaluated successfully");
    } else {
      throw new Error("Error in evaluating Coding Solution");
    }
  } catch (error) {
    console.error("Error in evaluating Coding Solution:", error);
    return Promise.reject("Error in evaluating Coding Solution");
  }
}

export async function translationService(
  submissionId: string
): Promise<String> {
  try {
    // fetch submission
    const submission = await Submission.findById(submissionId);
    if (!submission || submission === null) {
      return Promise.reject("Submission not found");
    }

    interface SummaryResponse {
      text: string;
    }

    const response = await axios.post<SummaryResponse>(
      `${FLASK_API}/translate`,
      {
        solution: submission.extractedContent,
      }
    );

    if (response.data && response.data.text) {
      submission.extractedContent = response.data.text;
      await submission.save();

      return Promise.resolve("Translated successfully");
    } else {
      throw new Error("Error in translation");
    }
  } catch (error) {
    console.error("Error in translation:", error);
    return Promise.reject("Error in translation");
  }
}

export async function evaluateInnovation(submissionId: string) {
  try {
    // fetch submission
    const submission = await Submission.findById(submissionId);
    if (!submission || submission === null) {
      return Promise.reject("Submission not found");
    }

    // fetch event corresponding to this solution
    const event = await Event.findById(submission.event);
    if (!event || event === null) {
      return Promise.reject("Event not found");
    }

    interface SummaryResponse {
      finalScore: number;
    }

    const response = await axios.post<SummaryResponse>(
      `${FLASK_API}/evaluate/innovation`,
      {
        text: submission.extractedContent,
      }
    );

    if (response.data && response.data.finalScore) {
      submission.finalScore = +response.data.finalScore;
      await submission.save();

      return Promise.resolve("Innovation Solution evaluated successfully");
    } else {
      throw new Error("Error in evaluating Innovation Solution");
    }
  } catch (error) {
    console.error("Error in evaluating Innovation Solution:", error);
    return Promise.reject("Error in evaluating Innovation Solution");
  }
}

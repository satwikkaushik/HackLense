import Submission from "@/schema/submissions";
import Event from "@/schema/events";
import axios from "axios";

const FLASK_API = process.env.FLASK_API_URL || "http://localhost:3001";

export async function getSubmissionSummaryService(
  submissionId: string
): Promise<String> {
  try {
    // fetch submission
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      throw new Error("Submission not found");
    }

    // fetch event corresponding to this solution
    const event = await Event.findById(submission.event);
    if (!event) {
      throw new Error("Event not found");
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

    if (!response.data?.summary) {
      throw new Error("Error in generating summary");
    }

    submission.summary = response.data.summary;
    await submission.save();

    return "Summary generated successfully";
  } catch (error) {
    console.error("Error generating keywords:", error);
    throw new Error("Error in generating summary");
  }
}

export async function getEventKeywordsService(eventId: string) {
  try {
    // fetch event corresponding to this solution
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
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

    if (!response.data?.keywords || !Array.isArray(response.data.keywords)) {
      throw new Error("Error in generating keywords");
    }

    event.keywords = response.data.keywords;
    await event.save();

    return "Keywords generated successfully";
  } catch (error) {
    console.error("Error generating keywords:", error);
    throw new Error("Error in generating keywords");
  }
}

export async function generateTestCasesService(eventId: string) {
  try {
    // fetch event corresponding to this solution
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
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

    // Validate response
    if (!response.data?.testCases) {
      throw new Error("Error in generating test cases");
    }

    // Extract JSON from the string response
    const jsonMatch = response.data.testCases.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch?.[1]) {
      throw new Error("Error parsing test cases JSON");
    }

    event.testCases = JSON.parse(jsonMatch[1]);
    await event.save();
    return "Test cases generated successfully";
  } catch (error) {
    console.error("Error generating Test Cases:", error);
    throw new Error("Error in generating test cases");
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

    if (response.status !== 200 || !response.data) {
      throw new Error("Error extracting data from file");
    }

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      console.log("Submission not found");
      throw new Error("Submission not found");
    }

    submission.extractedContent = response.data.text || "";
    await submission.save();
    return "Data extracted successfully";
  } catch (error) {
    console.log("Error in extracting data:", error);
    throw new Error("Error in extracting data");
  }
}

export async function evaluateMathsScienceService(submissionId: string) {
  try {
    // fetch submission
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      throw new Error("Submission not found");
    }

    // fetch event corresponding to this solution
    const event = await Event.findById(submission.event);
    if (!event) {
      throw new Error("Event not found");
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

    if (!response.data || typeof response.data.score !== "number") {
      throw new Error("Error in evaluating Maths Science Solution");
    }

    submission.finalScore = response.data.score;
    await submission.save();

    return "Maths Science Solution evaluated successfully";
  } catch (error) {
    console.error("Error in evaluating Maths Science Solution:", error);
    throw new Error("Error in evaluating Maths Science Solution");
  }
}

export async function evaluateCodingService(submissionId: string) {
  try {
    // fetch submission
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      throw new Error("Submission not found");
    }

    // fetch event corresponding to this solution
    const event = await Event.findById(submission.event);
    if (!event) {
      throw new Error("Event not found");
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

    if (!response.data || typeof response.data.score !== "number") {
      throw new Error("Error in evaluating Coding Solution");
    }

    submission.finalScore = response.data.score;
    await submission.save();

    return "Coding Solution evaluated successfully";
  } catch (error) {
    console.error("Error in evaluating Coding Solution:", error);
    throw new Error("Error in evaluating Coding Solution");
  }
}

export async function translationService(
  submissionId: string
): Promise<String> {
  try {
    // fetch submission
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      throw new Error("Submission not found");
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

    if (!response.data || !response.data.text) {
      throw new Error("Error in translation");
    }

    submission.extractedContent = response.data.text;
    await submission.save();

    return "Translated successfully";
  } catch (error) {
    console.error("Error in translation:", error);
    throw new Error("Error in translation");
  }
}

export async function evaluateInnovation(submissionId: string) {
  try {
    // fetch submission
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      throw new Error("Submission not found");
    }

    // fetch event corresponding to this solution
    const event = await Event.findById(submission.event);
    if (!event) {
      throw new Error("Event not found");
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

    if (!response.data || typeof response.data.finalScore !== "number") {
      throw new Error("Error in evaluating Innovation Solution");
    }

    submission.finalScore = +response.data.finalScore;
    await submission.save();

    return "Innovation Solution evaluated successfully";
  } catch (error) {
    console.error("Error in evaluating Innovation Solution:", error);
    throw new Error("Error in evaluating Innovation Solution");
  }
}

export async function evaluateLLMService(submissionId: string) {
  const defaultParams =
    "relevance, feasibility, innovation, presentation, impact, completeness, technical-depth";

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

    const userParams = event.parameters
      .sort((a, b) => b.priority - a.priority)
      .map((param) => param.name);

    interface SummaryResponse {
      result: {
        defaultParamsScore: string;
        paramsScore: number;
        paramsWise: string[];
        paramsWise_normalized: number[];
      };
    }

    const response = await axios.post<SummaryResponse>(
      `${FLASK_API}/evaluate/LLM`,
      {
        solution: submission.extractedContent,
        problem_statement: event.description,
        metrices: userParams,
        defaultParams: defaultParams,
      }
    );

    if (response.data && response.data.result) {
      const result = response.data.result;
      const finalScore =
        +result.defaultParamsScore * 0.7 + result.paramsScore * 0.3;

      submission.finalScore = finalScore;
      submission.paramsWise = result.paramsWise;
      submission.defaultParamsScore = +result.defaultParamsScore;

      await submission.save();

      return Promise.resolve("LLM Solution evaluated successfully");
    } else {
      throw new Error("Error in evaluating LLM Solution");
    }
  } catch (error) {
    console.log("Error in evaluating LLM Solution:", error);
    return Promise.reject("Error in evaluating LLM Solution");
  }
}

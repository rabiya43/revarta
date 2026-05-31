import { createOpenAI } from "@ai-sdk/openai";
import { generateText, streamText } from "ai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const interviewModel = openai(
  process.env.OPENAI_INTERVIEW_MODEL ?? "gpt-4o-mini"
);

export const feedbackModel = openai(
  process.env.OPENAI_FEEDBACK_MODEL ?? "gpt-4o-mini"
);

export { streamText, generateText };

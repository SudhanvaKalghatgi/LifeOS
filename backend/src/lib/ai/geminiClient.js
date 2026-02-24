import { GoogleGenerativeAI } from "@google/generative-ai";
import { ApiError } from "../../utils/ApiError.js";
import { ENV } from "../../config/env.js";

/**
 * Safe Gemini client initializer
 */
const getGeminiClient = () => {
  const key = ENV.GEMINI_API_KEY;

  if (!key) {
    throw new ApiError(500, "GEMINI_API_KEY is missing");
  }

  return new GoogleGenerativeAI(key);
};

/**
 * Supported Gemini models with fallback priority
 * These match currently available models
 */
const getGeminiModelCandidates = (genAI) => {
  const modelCandidates = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-flash-latest",
  ];

  return {
    candidates: modelCandidates,
    createModel: (name) =>
      genAI.getGenerativeModel({
        model: name,
      }),
  };
};

/**
 * Extract JSON safely from Gemini response
 */
const extractJsonFromText = (text) => {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new ApiError(500, "Gemini did not return valid JSON");
  }

  const jsonString = text.slice(start, end + 1);

  try {
    return JSON.parse(jsonString);
  } catch {
    throw new ApiError(500, "Invalid JSON returned by Gemini");
  }
};

/**
 * Main AI content generator with model fallback
 */
export const generateAIContent = async (prompt) => {
  try {
    const genAI = getGeminiClient();

    const { candidates, createModel } =
      getGeminiModelCandidates(genAI);

    let lastError = null;

    for (const modelName of candidates) {
      try {
        console.log(`🤖 Trying Gemini model: ${modelName}`);

        const model = createModel(modelName);

        const result = await model.generateContent(prompt);

        const text = result?.response?.text?.();

        if (!text) {
          throw new ApiError(
            500,
            `Empty response from model: ${modelName}`
          );
        }

        console.log(`✅ Gemini success with model: ${modelName}`);

        return extractJsonFromText(text);

      } catch (err) {

        lastError = err;

        console.log(
          `❌ Gemini model failed: ${modelName} -> ${err.message}`
        );

        continue;
      }
    }

    throw new ApiError(
      500,
      lastError?.message ||
        "All Gemini models failed"
    );

  } catch (error) {

    console.error(
      "❌ Gemini AI generation failed:",
      error.message
    );

    return null;
  }
};
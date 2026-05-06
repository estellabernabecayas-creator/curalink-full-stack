import express from 'express';
import fs from 'fs';
import { GoogleGenAI } from "@google/genai";

// Set credentials for Vertex AI from environment variable
if (process.env.GOOGLE_CREDENTIALS_BASE64) {
  // Decode base64 credentials and write to temp file for Render
  const credentialsJson = JSON.parse(Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString());
  const tempPath = '/tmp/service-account.json';
  fs.writeFileSync(tempPath, JSON.stringify(credentialsJson));
  process.env.GOOGLE_APPLICATION_CREDENTIALS = tempPath;
} else {
  // Fallback to local file for development
  process.env.GOOGLE_APPLICATION_CREDENTIALS = "./service-account.json";
}

const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: process.env.GOOGLE_CLOUD_LOCATION,
});

const router = express.Router();

const SPECIALTIES = [
  "Gastroenterologist",
  "General Physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatrician",
  "Neurologist"
];

function buildAssessmentPrompt(answers) {
  const formattedAnswers = answers.map((a, i) => `Q${i + 1}: ${a.question}\nA: ${a.answer}`).join("\n\n");
  return `You are a medical triage assistant for a healthcare booking platform. A user has completed a 15-question self-assessment. Based ONLY on their responses, recommend exactly ONE doctor specialization they should consult from this list: ${SPECIALTIES.join(", ")}.

CRITICAL RULES:
- Do NOT diagnose the user.
- Do NOT prescribe medicine.
- Only recommend which doctor specialization the user may consult.
- Return ONLY a valid JSON object. No markdown, no extra text.
- In the "reason" field, use bullet points to explain why this specialization is recommended.

Assessment Answers:
${formattedAnswers}

Return JSON in this exact format:
{
  "recommendedSpecialization": "",
  "confidence": "Low | Moderate | High",
  "reason": "",
  "disclaimer": "This recommendation is for guidance only and does not replace professional medical advice."
}`;
}

function buildChatPrompt(answers, recommendation, message) {
  const formattedAnswers = answers.map((a, i) => `Q${i + 1}: ${a.question}\nA: ${a.answer}`).join("\n\n");
  return `You are a helpful medical triage assistant for a healthcare booking platform.

User Assessment:
${formattedAnswers}

Recommended Specialization: ${recommendation.recommendedSpecialization}
Reason: ${recommendation.reason}

The user asks: "${message}"

CRITICAL RULES:
- Explain the recommendation and answer follow-up questions.
- Do NOT diagnose the user.
- Do NOT prescribe medicine.
- Keep responses concise, friendly, and informative.
- FORMAT: Always use bullet points (• or -) for:
  * Lists of any kind
  * Summaries
  * Explaining multiple points
  * When the user asks for bullet points or clear formatting
- Always remind the user that this is not a substitute for professional medical advice.
- Do NOT return JSON; respond in plain text.`;
}

async function callGemini(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return response.text;
}

// POST /api/self-assessment
router.post("/self-assessment", async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ success: false, message: "Missing or invalid answers array." });
    }

    const prompt = buildAssessmentPrompt(answers);
    let rawText = await callGemini(prompt);

    // Clean up markdown code blocks if present
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

    let result;
    try {
      result = JSON.parse(rawText);
    } catch (parseErr) {
      console.error("Gemini JSON parse error:", parseErr.message);
      console.error("Raw response:", rawText);
      return res.status(500).json({
        success: false,
        message: "Failed to parse AI response. Please try again.",
      });
    }

    // Validate that the specialization is in the allowed list
    if (!SPECIALTIES.includes(result.recommendedSpecialization)) {
      // If not, pick the closest one or default to General Physician
      const lower = result.recommendedSpecialization.toLowerCase();
      const matched = SPECIALTIES.find(s => lower.includes(s.toLowerCase())) || "General Physician";
      result.recommendedSpecialization = matched;
    }

    return res.json({ success: true, recommendation: result });
  } catch (error) {
    console.error("Error in /api/self-assessment:", error);
    return res.status(500).json({ success: false, message: error.message || "AI service error." });
  }
});

// POST /api/ai-chat
router.post("/ai-chat", async (req, res) => {
  try {
    const { answers, recommendation, message } = req.body;

    if (!answers || !recommendation || !message) {
      return res.status(400).json({ success: false, message: "Missing answers, recommendation, or message." });
    }

    const prompt = buildChatPrompt(answers, recommendation, message);
    const reply = await callGemini(prompt);

    return res.json({ success: true, reply });
  } catch (error) {
    console.error("Error in /api/ai-chat:", error);
    return res.status(500).json({ success: false, message: error.message || "AI chat service error." });
  }
});

export default router;

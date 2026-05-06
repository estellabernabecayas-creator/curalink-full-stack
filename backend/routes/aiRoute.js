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
- Keep responses concise, friendly, and conversational.
- FORMAT: Always use bullet points (• or -) for:
  * Lists of any kind
  * Summaries
  * Explaining multiple points
  * When the user asks for bullet points or clear formatting
- Do NOT include disclaimers or warnings in every response - only if the user asks for medical advice directly.
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

// POST /api/general-chat
router.post("/general-chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Missing message." });
    }

    const prompt = `You are a helpful assistant for CuraLink, a comprehensive healthcare booking platform. You have complete knowledge of how the website works and can guide users through all features.

## CURALINK WEBSITE STRUCTURE:

### MAIN NAVIGATION:
- **HOME (/)**: Landing page with hero section, features, and self-assessment access
- **ALL DOCTORS (/doctors)**: Browse all doctors or filter by specialty (/doctors/{speciality})
- **ABOUT US (/about)**: Company information and mission
- **CONTACT (/contact)**: Contact form and support information
- **LOGIN (/login)**: User authentication with Login/Create account tabs

### USER ACCOUNT PAGES (requires login):
- **MY PROFILE (/my-profile)**: Manage personal information, medical history
- **MY APPOINTMENTS (/my-appointments)**: View, manage, and pay for appointments
- **APPOINTMENT BOOKING (/appointment/{docId})**: Book specific doctor with date/time selection

### DOCTOR SPECIALTIES AVAILABLE:
- General physician
- Gynecologist  
- Dermatologist
- Pediatrician
- Neurologist
- Gastroenterologist

### APPOINTMENT BOOKING FLOW:
1. Browse doctors from homepage or "All Doctors" page
2. Click on desired doctor to view profile (fees, experience, about, address)
3. Click "Book an Appointment" button
4. Select available date from calendar
5. Select available time slot
6. Choose payment method (Online or Cash)
7. Complete booking and receive confirmation

### PAYMENT OPTIONS:
- **Online Payment**: Credit/debit cards, digital wallets (Stripe, Razorpay, PayMongo)
- **Cash Payment**: Pay at clinic, receive digital receipt
- All payments show in "My Appointments" with status (Pending, Paid, Completed, Cancelled)

### SELF-ASSESSMENT TOOL:
- 15-question health assessment (2-3 minutes)
- AI-powered recommendation for appropriate specialty
- Private and confidential
- Results include recommended specialist, confidence level, and reasoning
- Follow-up chat available for questions about recommendations
- Access via homepage "Self Assessment" button

### USER FEATURES:
- Dark/Light theme toggle (top-right)
- Responsive design (mobile & desktop)
- Profile completion tracking
- Appointment reminders
- Video consultation support (/video-consultation/{appointmentId})
- Email verification (/verify)
- Password reset (/reset-password)

### DOCTOR INFORMATION:
- Professional photos and credentials
- Specialization and experience
- Consultation fees (USD 30-80 range)
- Clinic addresses
- Patient reviews and ratings

IMPORTANT RULES:
- Provide specific, actionable guidance about CuraLink features
- Give exact page routes and navigation instructions
- Explain booking process step-by-step when asked
- Do NOT provide medical diagnoses or prescribe medications
- For medical concerns, always recommend consulting appropriate specialist
- Use bullet points (• or -) for lists and explanations
- Keep responses helpful and conversational
- Reference specific features and pages by name

User message: "${message}"

Provide a helpful, specific response about CuraLink:`;

    const reply = await callGemini(prompt);

    return res.json({ success: true, reply });
  } catch (error) {
    console.error("Error in /api/general-chat:", error);
    return res.status(500).json({ success: false, message: error.message || "AI chat service error." });
  }
});

export default router;

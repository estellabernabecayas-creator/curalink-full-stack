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

    // Fetch all dynamic data from database
    let systemData = {
      doctors: [],
      specialties: [],
      appointments: [],
      paymentMethods: ['Online Payment (Stripe, PayMongo)', 'Cash Payment at Clinic'],
      bookingFlow: [
        'Browse doctors from homepage or "All Doctors" page',
        'Click on desired doctor to view profile (fees, experience, about, address)',
        'Click "Book an Appointment" button',
        'Select available date from calendar',
        'Select available time slot',
        'Choose payment method (Online or Cash)',
        'Complete booking and receive confirmation'
      ],
      navigation: [
        { name: 'HOME', path: '/', description: 'Landing page with hero section, features, and self-assessment access' },
        { name: 'ALL DOCTORS', path: '/doctors', description: 'Browse all doctors or filter by specialty' },
        { name: 'ABOUT US', path: '/about', description: 'Company information and mission' },
        { name: 'CONTACT', path: '/contact', description: 'Contact form and support information' },
        { name: 'LOGIN', path: '/login', description: 'User authentication with Login/Create account tabs' }
      ],
      userPages: [
        { name: 'MY PROFILE', path: '/my-profile', description: 'Manage personal information, medical history' },
        { name: 'MY APPOINTMENTS', path: '/my-appointments', description: 'View, manage, and pay for appointments' },
        { name: 'APPOINTMENT BOOKING', path: '/appointment/{docId}', description: 'Book specific doctor with date/time selection' }
      ]
    };

    try {
      // Fetch doctors data
      const doctorModel = (await import('../models/doctorModel.js')).default;
      const doctorsData = await doctorModel.find({}).select('-password');
      systemData.doctors = doctorsData.map(doc => ({
        name: doc.name,
        speciality: doc.speciality,
        degree: doc.degree,
        experience: doc.experience,
        about: doc.about,
        fees: doc.fees,
        address: doc.address,
        _id: doc._id
      }));

      // Extract unique specialties
      const uniqueSpecialties = [...new Set(systemData.doctors.map(doc => doc.speciality))];
      systemData.specialties = uniqueSpecialties;

      // Fetch recent appointments for context
      const appointmentModel = (await import('../models/appointmentModel.js')).default;
      const recentAppointments = await appointmentModel.find({}).limit(5).sort({ createdAt: -1 });
      systemData.appointments = recentAppointments.map(apt => ({
        docId: apt.docId,
        userData: apt.userData,
        slotDate: apt.slotDate,
        slotTime: apt.slotTime,
        amount: apt.amount,
        payment: apt.payment,
        status: apt.payment ? 'Paid' : 'Pending'
      }));

    } catch (dbError) {
      console.log("Could not fetch system data, using fallback:", dbError.message);
    }

    // Create dynamic summaries
    const doctorSummary = systemData.doctors.length > 0 
      ? systemData.doctors.slice(0, 8).map(doc => 
          `Dr. ${doc.name} is a ${doc.speciality} with ${doc.experience} of experience. The consultation fee is ₱${doc.fees}.`
        ).join(' ')
      : "We have multiple doctors available across all specialties.";

    const specialtiesList = systemData.specialties.length > 0
      ? systemData.specialties.join(', ')
      : "General physician, Gynecologist, Dermatologist, Pediatrician, Neurologist, Gastroenterologist";

    const navigationList = systemData.navigation.map(nav => 
      `${nav.name} page for ${nav.description.toLowerCase()}`
    ).join(', ');

    const userPagesList = systemData.userPages.map(page => 
      `${page.name} where you can ${page.description.toLowerCase()}`
    ).join(', ');

    const bookingSteps = systemData.bookingFlow.join(' Then ');

    const paymentOptions = systemData.paymentMethods.join(' or ');

    const prompt = `You are a helpful assistant for CuraLink, a comprehensive healthcare booking platform. You have complete knowledge of how the website works and can guide users through all features.

## CURALINK WEBSITE STRUCTURE:

### MAIN NAVIGATION:
${navigationList}

### USER ACCOUNT PAGES (requires login):
${userPagesList}

### DOCTOR SPECIALTIES AVAILABLE:
${specialtiesList}

### APPOINTMENT BOOKING FLOW:
${bookingSteps}

### PAYMENT OPTIONS:
${paymentOptions}
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
- Consultation fees (varies by doctor)
- Clinic addresses
- Patient reviews and ratings

### CURRENT DOCTORS AVAILABLE:
${doctorSummary}

*Note: This list shows currently available doctors. Visit /doctors to see all options and detailed profiles.*

IMPORTANT RULES:
- Provide helpful, friendly guidance about CuraLink features
- Write in natural, conversational language (no code syntax)
- Use - for bullet points when listing items
- Explain things step-by-step when asked
- Do NOT provide medical diagnoses or prescribe medications
- For medical concerns, always recommend consulting appropriate specialist
- Keep responses short and easy to read
- Focus on being helpful, not technical

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

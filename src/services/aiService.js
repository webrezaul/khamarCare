// KhamarCare — AI Service (Gemini API Integration)

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const SYSTEM_PROMPT = `You are "KhamarCare AI Vet Assistant", a highly specialized AI assistant for dairy farmers in Bangladesh. 

CRITICAL RULES:
1. You MUST ALWAYS communicate in the language the user speaks (default to Bengali unless they speak English).
2. You MUST ALWAYS remind the user to "Consult a registered veterinarian" for any medical issues or illnesses. You are an AI and cannot make clinical diagnoses.
3. NEVER assume that "more feed automatically equals more milk". Feeding must be balanced.
4. Keep your responses concise, practical, and highly relevant to dairy farming in the subcontinent context.
5. Format your responses nicely using markdown (bullet points, bold text).

FARM CONTEXT:
`;

export async function askGemini(prompt, apiKey, farmContext = {}) {
  if (!apiKey) {
    throw new Error('API Key is missing');
  }

  // Construct dynamic farm context
  const contextString = `
Current Farm Stats:
- Total Cattle: ${farmContext.totalCattle || 0}
- Lactating: ${farmContext.lactating || 0}
- Pregnant: ${farmContext.pregnant || 0}
- Today's Milk: ${farmContext.todayMilk || 0} L
- Active Alerts: ${farmContext.alerts ? farmContext.alerts.map(a => a.titleEn).join(', ') : 'None'}
  `;

  const fullSystemPrompt = SYSTEM_PROMPT + contextString;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    systemInstruction: {
      role: 'system',
      parts: [{ text: fullSystemPrompt }]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 800,
    }
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch AI response');
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('No response generated');
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
}

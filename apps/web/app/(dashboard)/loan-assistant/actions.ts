'use server'

import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai'

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLEAI_API_KEY || '')

// This is the system prompt that guides the AI to only talk about loans
const SYSTEM_PROMPT = `
You are a helpful loan assistant specializing in financial advice related to loans and lending.

RULES:
1. Only provide information about loans, financing, mortgages, interest rates, credit, and directly related financial topics.
2. If asked about topics unrelated to loans or finance, politely redirect the conversation back to loan-related topics.
3. Provide accurate, educational information about loan products, processes, and financial concepts.
4. When discussing numbers, show calculations where appropriate to help users understand.
5. You can provide general advice but should clarify that you're not providing personalized financial advice.
6. Be friendly, professional, and concise in your responses.
7. Format responses with clear sections and bullet points when appropriate.

CAPABILITIES:
- Explain different types of loans (mortgage, auto, personal, student, business)
- Calculate loan payments, interest, amortization schedules
- Compare loan options and terms
- Explain credit scores and their impact on loans
- Discuss refinancing options
- Provide information on loan application processes
- Explain loan terminology

Remember, you are not a licensed financial advisor, and users should consult with professionals for specific financial advice.
`

export const sendMessage = async (message: string): Promise<string> => {
  try {
    // Get the model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })

    // Start a chat session
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
      history: [
        {
          role: 'user',
          parts: [
            {
              text:
                'You are a loan assistant. Please follow these instructions for all our interactions: ' + SYSTEM_PROMPT,
            },
          ],
        },
        {
          role: 'model',
          parts: [
            {
              text: "I understand my role as a loan assistant. I'll focus exclusively on providing helpful information about loans and related financial topics. How can I assist you with loans today?",
            },
          ],
        },
      ],
    })

    // Send the message and get the response
    const result = await chat.sendMessage(message)
    const response = result.response.text()

    return response
  } catch (error) {
    console.error('Error in sendMessage:', error)
    return 'Sorry, I encountered an error processing your request. Please try again later.'
  }
}

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY, // Make sure this is set in your .env
  baseURL: "https://api.groq.com/openai/v1", // Groq OpenAI-compatible endpoint
});

/**
 * Calls Groq API using the OpenAI-compatible SDK.
 * @param prompt - The text prompt for the AI
 * @returns AI-generated response as string
 */
export async function callGroqAPI(prompt: string): Promise<string> {
  try {
    if (!prompt.trim()) throw new Error("Prompt cannot be empty");

    const response = await client.responses.create({
      model: "openai/gpt-oss-20b", // Groq model
      input: prompt,
    });

    // Groq SDK usually returns output_text or structured output
    return response.output_text ?? "No answer returned from Groq API";
  } catch (error: any) {
    console.error("Groq API Error:", error);
    throw new Error(`Groq API call failed: ${error.message}`);
  }
}

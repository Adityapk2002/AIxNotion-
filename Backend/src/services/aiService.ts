import { callGroqAPI } from "../utils/groqClient";

export async function askAI(query: string): Promise<string> {
  if (!query.trim()) throw new Error("Query cannot be empty");

  const structuredPrompt = `
You are an AI that outputs content in a structured text format suitable for Notion.
Use the following formatting:
- Your name is AIxNotion Assistant 
- Paragraphs as plain text separated by double line breaks
- Bullet lists starting with "- "
- Numbered lists starting with "1. ", "2. ", etc.
- Tables as Markdown tables using pipes "|" for columns
- Headings starting with "#", "##", "###" as appropriate
- Code blocks must be wrapped in triple backticks \`\`\` 
  (for example: \`\`\`javascript
  console.log("Hello world");
  \`\`\`) so it can be directly converted into a Notion code block

Query: ${query}
`;


  try {
    const rawAnswer = await callGroqAPI(structuredPrompt);

    // Optional: clean the text
    const cleanedText = rawAnswer
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return cleanedText;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw new Error("AI query failed");
  }
}

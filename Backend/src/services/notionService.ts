import { notion } from "../utils/notionClient";

export async function saveToNotion(content: string): Promise<void> {
  try {
    await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID! },
      properties: {
        Title: {
          title: [{ text: { content } }],
        },
      },
    });
  } catch (error) {
    console.error("Notion Service Error:", error);
    throw new Error("Failed to push content to Notion");
  }
}
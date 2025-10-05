import express from "express";
import { saveToNotion } from "../services/notionService";
const app = express()

app.post("/", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    await saveToNotion(content);

    res.json({ success: true });
  } catch (error) {
    console.error("Notion Route Error:", error);
    res.status(500).json({ error: "Failed to push content to Notion" });
  }
});

export default app;
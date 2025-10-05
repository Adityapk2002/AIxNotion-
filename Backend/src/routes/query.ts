import { Router } from "express";
import { askAI } from "../services/aiService";

const router = Router();

router.post("/", async (req, res) => {
  console.log("Received body:", req.body); 
  const { query } = req.body;

  if (!query) return res.status(400).json({ error: "Query is required" });

  try {
    const answer = await askAI(query);
    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI query failed" });
  }
});

export default router;

import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  const { databaseId, botToken } = req.query;

  if (!databaseId || !botToken) {
    return res.status(400).json({ error: "Database ID and Bot Token required" });
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${botToken}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ page_size: 50 }) // fetch last 50 entries
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();

    const chats = data.results.map((page: any) => ({
      id: page.id,
      text: page.children?.map((c: any) => c.paragraph?.rich_text?.map((r: any) => r.text.content).join("") ).join("\n") || "",
      query: page.properties?.Name?.title[0]?.text?.content || "",
      timestamp: page.properties["Date Saved"]?.date?.start
    }));

    res.json(chats);
  } catch (error) {
    console.error("Notion History Error:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

export default router;

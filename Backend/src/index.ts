import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import queryRouter from "./routes/query";
import notionRouter from "./routes/notion";
import notionHistoryRouter from "./routes/notionHistory";

const app = express();
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend URL
  credentials: true,
}));

app.use(cors());
app.use(express.json());

app.use("/api/query", queryRouter);
app.use("/api/notion", notionRouter);
app.use("/api/notion/history", notionHistoryRouter);


app.listen(3000, () => {
  console.log(`🚀 Server running on 3000`);
});
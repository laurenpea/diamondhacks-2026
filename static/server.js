
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { truthStore } from "./data.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// THE GENERATION ENDPOINT
app.get("/api/generate", async (req, res) => {
  try {
    const seed = truthStore[Math.floor(Math.random() * truthStore.length)];
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Write a 6-sentence educational paragraph about ${seed.topic}. 
    Include this exact false statement: "${seed.statement}". 
    The rest must be factual. Return ONLY the text.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ 
      paragraph: text, 
      factId: seed.id 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate challenge" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { truthStore } from "./static/data.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

if (!apiKey) {
  throw new Error("Missing Gemini API key. Set GEMINI_API_KEY or API_KEY in your .env file.");
}

const genAI = new GoogleGenerativeAI(apiKey);

function splitSentences(text) {
  const matches = text.match(/[^.!?]+[.!?]+(?:["'])?/g);
  return (matches ?? [])
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function normalizeSentence(text) {
  return text
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\s+/g, " ");
}

// THE GENERATION ENDPOINT
app.get("/api/generate", async (req, res) => {
  try {
    const seed = truthStore[Math.floor(Math.random() * truthStore.length)];
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Write a 6-sentence educational paragraph about ${seed.topic}.
Include this exact false statement as one complete sentence, with the same punctuation: "${seed.statement}"
The other 5 sentences must be factual and about the same topic.
Return ONLY the paragraph text with no bullet points, labels, or markdown.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    let sentences = splitSentences(text);

    const normalizedFalseStatement = normalizeSentence(seed.statement);
    let falseSentenceIndex = sentences.findIndex(
      (sentence) => normalizeSentence(sentence) === normalizedFalseStatement
    );

    // Keep the challenge playable even if the model paraphrases or omits the seed sentence.
    if (falseSentenceIndex === -1) {
      if (sentences.length === 0) {
        sentences = [seed.statement];
      } else if (sentences.length >= 6) {
        sentences[1] = seed.statement;
      } else {
        sentences.push(seed.statement);
      }

      falseSentenceIndex = sentences.findIndex(
        (sentence) => normalizeSentence(sentence) === normalizedFalseStatement
      );
    }

    const labeledSentences = sentences.map((sentence, index) => ({
      id: `${seed.id}_${index + 1}`,
      text: sentence,
      isFalse: index === falseSentenceIndex
    }));

    res.json({ 
      paragraph: labeledSentences.map((sentence) => sentence.text).join(" "),
      factId: seed.id,
      topic: seed.topic,
      falseStatement: seed.statement,
      sentences: labeledSentences
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error?.message || "Failed to generate challenge"
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

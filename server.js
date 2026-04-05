
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { truthStore } from "./data.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

if (!apiKey) {
  throw new Error("Missing Gemini API key. Set GEMINI_API_KEY or API_KEY in your .env file.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const LEVEL_CONFIGS = {
  "1": {
    subjectLabel: "Biology",
    topicMatches: ["Human Biology", "Health"],
    sentenceCount: 3,
    paragraphCount: 1,
    falseCountOptions: [1]
  },
  "2": {
    subjectLabel: "History",
    topicMatches: ["History"],
    sentenceCount: 5,
    paragraphCount: 1,
    falseCountOptions: [2]
  },
  "3": {
    subjectLabel: "Physics and Astronomy",
    topicMatches: ["Physics", "Astronomy"],
    sentenceCount: 6,
    paragraphCount: 1,
    falseCountOptions: [2]
  },
  "4": {
    subjectLabel: "Literature and Critical Thinking",
    topicMatches: ["Literature", "Politics"],
    sentenceCount: 7,
    paragraphCount: 2,
    falseCountOptions: [3]
  },
  "5": {
    subjectLabel: "Chemistry",
    topicMatches: ["Chemistry"],
    sentenceCount: 8,
    paragraphCount: 2,
    falseCountOptions: [0, 1, 2]
  }
};

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

function sampleItems(items, count) {
  const pool = [...items];
  const picked = [];

  while (pool.length > 0 && picked.length < count) {
    const index = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(index, 1)[0]);
  }

  return picked;
}

function parseJsonResponse(text) {
  const trimmed = text.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fencedMatch ? fencedMatch[1].trim() : trimmed;
  return JSON.parse(candidate);
}

function buildParagraphs(sentences, paragraphCount) {
  if (paragraphCount <= 1) {
    return [sentences];
  }

  const paragraphs = [];
  const baseSize = Math.floor(sentences.length / paragraphCount);
  const remainder = sentences.length % paragraphCount;
  let offset = 0;

  for (let i = 0; i < paragraphCount; i += 1) {
    const size = baseSize + (i < remainder ? 1 : 0);
    paragraphs.push(sentences.slice(offset, offset + size));
    offset += size;
  }

  return paragraphs.filter((paragraph) => paragraph.length > 0);
}

// THE GENERATION ENDPOINT
app.get("/api/generate", async (req, res) => {
  try {
    const level = String(req.query.level ?? "1");
    const config = LEVEL_CONFIGS[level] ?? LEVEL_CONFIGS["1"];
    const eligibleFacts = truthStore.filter((fact) =>
      config.topicMatches.some((topic) =>
        fact.topic.toLowerCase().includes(topic.toLowerCase())
      )
    );

    if (eligibleFacts.length === 0) {
      throw new Error(`No fact seeds found for level ${level}.`);
    }

    const falseCount =
      config.falseCountOptions[
        Math.floor(Math.random() * config.falseCountOptions.length)
      ];
    const falseFacts = sampleItems(
      eligibleFacts,
      Math.min(falseCount, eligibleFacts.length)
    );
    const trueFacts = sampleItems(
      eligibleFacts.filter(
        (fact) => !falseFacts.some((falseFact) => falseFact.id === fact.id)
      ),
      Math.min(config.sentenceCount, eligibleFacts.length)
    );
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const falseStatementBlock =
      falseFacts.length > 0
        ? falseFacts
            .map(
              (fact, index) =>
                `${index + 1}. [${fact.id}] ${fact.statement}`
            )
            .join("\n")
        : "None for this challenge.";

    const trueFactBlock = trueFacts
      .map(
        (fact, index) =>
          `${index + 1}. [${fact.id}] Topic: ${fact.topic}. True fact: ${fact.true_fact}`
      )
      .join("\n");

    const prompt = `Create a hallucination-identification challenge.
Subject area: ${config.subjectLabel}.
Write exactly ${config.sentenceCount} standalone sentences arranged as ${config.paragraphCount} paragraph(s).
Stay strictly within ${config.subjectLabel}. Do not drift into unrelated subjects.

False statements to include verbatim but disguised in complete sentences exactly once each:
${falseStatementBlock}

Use true facts for the other sentences that are relevant to ${config.subjectLabel}.

Requirements:
- Return valid JSON only.
- Use this exact shape: {"sentences":["Sentence 1.","Sentence 2."],"paragraphCount":${config.paragraphCount}}
- Every item in "sentences" must be exactly one sentence.
- Do not include markdown, labels, fact ids, or explanations.`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();
    let generated;

    try {
      generated = parseJsonResponse(rawText);
    } catch {
      generated = { sentences: splitSentences(rawText) };
    }

    let sentences = Array.isArray(generated.sentences)
      ? generated.sentences.map((sentence) => normalizeSentence(sentence))
      : [];

    const normalizedFalseStatements = falseFacts.map((fact) =>
      normalizeSentence(fact.statement)
    );

    normalizedFalseStatements.forEach((falseStatement) => {
      if (!sentences.includes(falseStatement)) {
        sentences.push(falseStatement);
      }
    });

    const factualFallbacks = trueFacts.map((fact) => normalizeSentence(fact.true_fact));
    let fallbackIndex = 0;
    while (sentences.length < config.sentenceCount && fallbackIndex < factualFallbacks.length) {
      const candidate = factualFallbacks[fallbackIndex];
      if (!sentences.includes(candidate)) {
        sentences.push(candidate);
      }
      fallbackIndex += 1;
    }

    if (sentences.length > config.sentenceCount) {
      const mustKeep = new Set(normalizedFalseStatements);
      const kept = [];
      const removable = [];

      sentences.forEach((sentence) => {
        if (mustKeep.has(normalizeSentence(sentence))) {
          kept.push(sentence);
        } else {
          removable.push(sentence);
        }
      });

      sentences = [...kept, ...removable].slice(0, config.sentenceCount);
    }

    const labeledSentences = sentences.map((sentence, index) => ({
      id: `lvl${level}_${index + 1}`,
      text: sentence,
      isFalse: normalizedFalseStatements.includes(normalizeSentence(sentence))
    }));
    const paragraphs = buildParagraphs(labeledSentences, config.paragraphCount);
    const corrections = falseFacts.map((fact) => ({
      factId: fact.id,
      statement: fact.statement,
      trueFact: fact.true_fact,
      source: fact.research_source
    }));

    res.json({ 
      level,
      topic: config.subjectLabel,
      factIds: [...falseFacts, ...trueFacts].map((fact) => fact.id),
      falseCount,
      sentences: labeledSentences,
      paragraphs,
      corrections
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

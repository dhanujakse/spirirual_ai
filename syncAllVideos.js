import sqlite3 from 'sqlite3';
import axios from 'axios';
import dotenv from 'dotenv';
import { YoutubeTranscript } from 'youtube-transcript/dist/youtube-transcript.esm.js';

dotenv.config();

const OPENROUTER_API_KEY = process.env.VITE_OPENROUTER_KEY || process.env.OPENROUTER_API_KEY || "";
const db = new sqlite3.Database('videos.db');

async function generateLLMDescriptions(videoId, title, ytDesc) {
    if (!OPENROUTER_API_KEY) return { english: "LLM Key Missing", tamil: "திறவுகோல் இல்லை" };

    let captionsText = "";
    try {
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);
        captionsText = transcript.map(t => t.text).join(" ").substring(0, 1500); // 1500 chars for richer context
    } catch (e) {
        console.warn(`No captions found for ${videoId}. Using title/desc.`);
    }

    const promptContext = `Video Title: "${title}". Desc: "${ytDesc ? ytDesc : 'Empty'}". Captions (if any): "${captionsText}".`;

    try {
        const res = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "google/gemini-2.5-flash",
            response_format: { type: "json_object" },
            max_tokens: 1500,
            messages: [
                {
                    role: "system",
                    content: "Analyze the video context. Detect the main language accurately. Output a JSON object STRICTLY matching EXACTLY this format: { \"english\": \"Highly detailed, multi-paragraph English description extracting all key facts, topics, and teachings from the video. Ensure enough details are provided so that any user questions about the video can be answered from this summary alone.\", \"tamil\": \"Translated highly detailed description in Tamil.\" }. Never repeat the title. Ensure it is spiritual, accurate and student-friendly."
                },
                { role: "user", content: promptContext }
            ]
        }, {
            headers: { "Authorization": `Bearer ${OPENROUTER_API_KEY}`, "Content-Type": "application/json" }
        });

        const content = res.data.choices[0].message.content.trim();
        const cleanContent = content.replace(/```json/i, '').replace(/```/i, '').trim();
        return JSON.parse(cleanContent);

    } catch (e) {
        console.warn(`LLM parsing failed for ${videoId}:`, e.response?.data || e.message);
        return null;
    }
}

async function backfillMissingDescriptions() {
    console.log("Starting full database backfill...");
    db.all(`SELECT videoId, title, description, llmEnglish FROM videos 
            WHERE llmEnglish IS NULL 
            OR llmEnglish LIKE '%LLM Key Missing%' 
            OR llmEnglish LIKE '%A beautiful spiritual video%'
            OR length(llmEnglish) < 100`, async (err, rows) => {

        if (err) {
            console.error(err);
            return;
        }

        console.log(`Found ${rows.length} videos needing updated descriptions.`);

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            console.log(`Processing [${i + 1}/${rows.length}]: ${row.title}`);
            const llmOutput = await generateLLMDescriptions(row.videoId, row.title, row.description);
            if (llmOutput) {
                await new Promise((resolve) => {
                    db.run(`UPDATE videos SET llmEnglish = ?, llmTamil = ? WHERE videoId = ?`,
                        [llmOutput.english, llmOutput.tamil, row.videoId], () => {
                            console.log(`✅ Success: ${row.videoId}`);
                            resolve();
                        });
                });
            } else {
                console.log(`❌ Failed: ${row.videoId}`);
            }

            // Sleep to avoid ratelimits
            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        console.log("Backfill complete! You have rich descriptions for all videos.");
    });
}

backfillMissingDescriptions();

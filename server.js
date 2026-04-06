import express from 'express';
import sqlite3 from 'sqlite3';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { YoutubeTranscript } from 'youtube-transcript/dist/youtube-transcript.esm.js';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Quotes Logic (365 unique)
const quotesFile = JSON.parse(fs.readFileSync(join(__dirname, 'quotes.json'), 'utf8'));
let manualQuote = null;

app.get('/api/quote/daily', (req, res) => {
    if (manualQuote) return res.json(manualQuote);
    // 365 rotation logic anchored strictly on Julian day
    const start = new Date(new Date().getFullYear(), 0, 0);
    const diff = (new Date() - start) + ((start.getTimezoneOffset() - new Date().getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayIndex = Math.floor(diff / oneDay) % 365;
    
    // Fallback zero index
    const quote = quotesFile[dayIndex] || quotesFile[0];
    res.json(quote);
});

app.post('/api/quote/daily', (req, res) => {
    manualQuote = req.body;
    res.json({success: true, message: "Quote manually updated by admin!"});
});

// Initialize SQLite database
const db = new sqlite3.Database(join(__dirname, 'videos.db'), (err) => {
    if (err) console.error("Database connecting error", err.message);
});

// Update Database Schema with LLM fields and Events
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS videos (
        videoId TEXT PRIMARY KEY,
        title TEXT,
        description TEXT,
        category TEXT,
        thumbnail TEXT,
        publishedAt TEXT,
        llmEnglish TEXT,
        llmTamil TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        picture TEXT,
        mapUrl TEXT,
        streetName TEXT,
        startTime TEXT,
        endTime TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS event_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        eventId INTEGER,
        user TEXT,
        text TEXT,
        timestamp TEXT
    )`);
});

const API_KEY = process.env.YOUTUBE_API_KEY || "";
const OPENROUTER_API_KEY = process.env.VITE_OPENROUTER_KEY || process.env.OPENROUTER_API_KEY || "";
const CHANNEL_ID = "UCDGxL0Q44R22OL3dIRnrlkw";

// STRICT CATEGORIZATION LOGIC
const categorizeVideo = (title) => {
    const t = title.toLowerCase();

    const kirtanMatches = "kirtan|keerthan|bhajan|arati|aarti|sankirtan|sankirtana|parikrama kirtan|yajna kirtan|பஜனை|கீர்த்தனை|ஆரத்தி|adharam|akrodha|amar jivan|amar nitai|ambudanjan|ami jamuna|ami to|anadi karama|antara mandire|ar ke|ar koto|ara keno|are bhai|asalo katha|atma nivedana|avatara sara|bhaja gauranga|bhaja re|bhajah hu|bhale gaura|bhoga aarti|bhoga arati|yamunastakam|bhuliya|bolo hari|boro kripa|boro sukher|brahma samhita|carana kamal|devi suresvari|dhana mora|dhule dhule|doyala nitai|duhkher|durlabha|dusta mana|ei baro|ek din|ekhona|emona durmati|gangeya|gaura aarti|gaura arati|gaura pahu|gauranga|gay gaurchand|gay gour|gopinath|gurau|gurudeva|hari bolo|hari haray|hari hari|hari he|hari jaya|hari kabe|he govinda|huhunkara|jaya jagganath|jaya narasimha|narasimha arati|jaya radha|jayati|je anilo|jiva jago|kabe gaura|kabe habe|kabe mui|kabe sri|kadacit|jagannathastakam|kali kukkura|keno hare|kesava|ki jani|ki rupe|krishna hoite|krpa koro|krsna deva|krsna jinaka|krsna krsna|krsna prema|krsna tabe|kunkumakta|kusumita|madana mohana|madhuram|maha prasade|maine ratana|mama mana|manasa deho|mirar|yoga siddhir|nadiya|namo namah tulasi|tulasi arati|nanda ke|narada muni|nava nirada|nija karma|nija pati|nitai|ohe vaishnava|ore mana|ore vrndavaner|param karuna|prabhu tava|pranam mantras|pranam tomai|prapance|prasadam prayers|radha krishna|radha kunda|radhe jaya|radhe radhe|raja rani|sad goswami|sakhe kalaya|sarvasva tomar|sri damodara|sri dasavtar|sri guru caran|gurv-ashtakam|guru arati|sri hari vasare|sri jagganath|sri krishna caitanya|sri rupa|sri sacisuta|sri sri yamunastakam|srita kamala|suddha bhakat|sujanarbuda|sundara|suniyachi|tatala|thakura vaishnava|ten offenses|tumi sarveswareswara|udilo arun|ugram viram|ujjavala|ujjvala|vamsi dhari|vande krsna|vibhavari|vidyara|vraje prasiddham|vrindavan|vrndavana vasi|yadi gaura|yadi te|yashomati";
    if (new RegExp(kirtanMatches).test(t)) return "Kirtan";

    if (t.match(/kelvi badhil|கேள்வி பதில்|கேள்வி-பதில்|question|answer|q&a|q and a|q & a|\?/)) return "QnA";

    if (t.match(/chant|chanting|mantra|japa|pranama|vacha|uvaca|uvacha|ashtakam|astakam|sloka|slokam|dhyana|nama|sahasranamam|மந்திரம்|ஜபம்|ஸ்லோகம்|நாமம்/)) return "Chanting";
    if (t.match(/bhagavad gita|gita|srimad bhagavatam|bhagavatam|ramayana|ramayanam|valmiki ramayana|shree valmiki ramayana|chaitanya charitamrita|purusha suktam|bhakti sastri|canto|bhishma panchakam|lecture|shastra|sastra|rama lecture|uddhava gita|upanishad|laghu bhagavatamrta|sri laghu bhagavatamrta|mahabharatam|krishna leela|பகவத் கீதை|கீதை|பாகவதம்|ராமாயணம்|ஸ்ரீமத்|புருஷ சூக்தம்|பக்தி சாஸ்திரி|காண்டம்|ஸ்கந்தம்|பீஷ்ம பஞ்சகம்|சொற்பொழிவு|உரை|சாஸ்திரம்|சைதன்ய சரிதாம்ருதம்|உத்தவ கீதை|உபநிஷத்|மகாபாரதம்|கிருஷ்ண லீலை/)) return "Scripture";
    if (t.match(/appearance day|disappearance day|glories|glorification|acharya|guru puja|vyasa puja|பிரபுபாத|ஜெயந்தி/)) return "Glorification";
    if (t.match(/rama|krishna|lila|story|festival|navami|janmashtami|pastime|கதை|லீலை|ராம|கிருஷ்ண|பரமாத்மா|prahlada|quote|prabhupada quote|muni|rishi|goswami|maharaj|maharaja|alwar|nayanar|bhakta|முனிவர்|ரிஷி|கோஸ்வாமி|மகாராஜ்|ஆழ்வார்|நாயனார்|பக்தர்/)) return "Story";

    if (t.split(" ").length >= 4 && !t.match(/[\u0B80-\u0BFF]/)) return "Story";

    return "Scripture"; 
};

// AUTO-GENERATE LLM DESCRIPTION IF NEEDED
async function generateLLMDescriptions(videoId, title, ytDesc) {
    if (!OPENROUTER_API_KEY) return { english: "LLM Key Missing", tamil: "திறவுகோல் இல்லை" };

    let captionsText = "";
    try {
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);
        captionsText = transcript.map(t => t.text).join(" ").substring(0, 1000); // 1000 chars roughly 150 words
    } catch(e) {
        console.warn(`No captions found for ${videoId}. Failing cleanly to title/desc only.`);
    }

    const promptContext = `Video Title: "${title}". Desc: "${ytDesc ? ytDesc : 'Empty'}". Captions (if any): "${captionsText}".`;

    try {
        const res = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "google/gemini-2.5-flash:free",
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
        // Remove markdown JSON bounds if gemini injected them
        const cleanContent = content.replace(/```json/i, '').replace(/```/i, '').trim();
        return JSON.parse(cleanContent);

    } catch(e) {
        console.warn(`LLM parsing failed for ${videoId}`);
        return { english: "A beautiful spiritual video from Vamsidhari Dasa.", tamil: "இது வம்சிதாரி தாசாவின் அழகிய ஆன்மீக காணொளி." };
    }
}

// 1. Fetch channel's UPLOAD playlist ID
async function getUploadsPlaylistId() {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`;
    const res = await axios.get(url);
    if (res.data.items && res.data.items.length > 0) return res.data.items[0].contentDetails.relatedPlaylists.uploads;
    throw new Error("Could not find uploads playlist.");
}

// 3. RUN TIME / INITIAL: Sync ONLY latest + LLM Generation
app.post('/api/sync_latest', async (req, res) => {
    try {
        const uploadsPlaylistId = await getUploadsPlaylistId();
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=10&key=${API_KEY}`;
        const response = await axios.get(url);
        
        let inserted = 0;
        
        for (const item of response.data.items) {
            const s = item.snippet;
            const videoId = s.resourceId.videoId;
            const title = s.title;
            const description = s.description;
            const thumbnail = s.thumbnails?.high?.url || s.thumbnails?.default?.url;
            const publishedAt = s.publishedAt;
            const category = categorizeVideo(title, description);

            const existsRow = await new Promise((resolve) => {
                db.get(`SELECT videoId, llmEnglish FROM videos WHERE videoId = ?`, [videoId], (err, row) => resolve(row));
            });

            if (!existsRow) {
                // Video is new! Generate LLM Cache to save huge frontend latency.
                const llmOutput = await generateLLMDescriptions(videoId, title, description);
                
                await new Promise((resolve) => {
                    db.run(`INSERT INTO videos (videoId, title, description, thumbnail, publishedAt, category, llmEnglish, llmTamil) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
                    [videoId, title, description, thumbnail, publishedAt, category, llmOutput.english, llmOutput.tamil], () => {
                        inserted++;
                        resolve();
                    });
                });
            } else if (!existsRow.llmEnglish || existsRow.llmEnglish.includes("LLM Key Missing") || existsRow.llmEnglish.includes("A beautiful spiritual video")) {
                // Needs backfill!
                const llmOutput = await generateLLMDescriptions(videoId, title, description);
                await new Promise((resolve) => {
                    db.run(`UPDATE videos SET llmEnglish = ?, llmTamil = ? WHERE videoId = ?`, 
                    [llmOutput.english, llmOutput.tamil, videoId], () => {
                        inserted++;
                        resolve();
                    });
                });
            }
        }

        res.json({ message: "Latest sync complete.", inserted });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to sync latest videos." });
    }
});

app.get('/api/videos/latest', (req, res) => {
    db.all(`SELECT * FROM videos ORDER BY publishedAt DESC LIMIT 20`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
app.get('/api/videos', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    db.all(`SELECT * FROM videos ORDER BY publishedAt DESC LIMIT ? OFFSET ?`, [limit, offset], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        db.get(`SELECT COUNT(*) as total FROM videos`, [], (err, totalRow) => {
            res.json({
                data: rows,
                currentPage: page,
                totalPages: Math.ceil((totalRow ? totalRow.total : 0) / limit),
                totalVideos: totalRow ? totalRow.total : 0
            });
        });
    });
});

// EVENT ENDPOINTS
app.get('/api/events', (req, res) => {
    db.all(`SELECT * FROM events ORDER BY startTime DESC`, [], (err, rows) => res.json(rows || []));
});

app.post('/api/events', (req, res) => {
    const { title, picture, mapUrl, streetName, startTime, endTime } = req.body;
    db.run(`INSERT INTO events (title, picture, mapUrl, streetName, startTime, endTime) VALUES (?, ?, ?, ?, ?, ?)`, 
    [title, picture, mapUrl, streetName, startTime, endTime], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: this.lastID });
    });
});

app.get('/api/events/:id/comments', (req, res) => {
    db.all(`SELECT * FROM event_comments WHERE eventId = ? ORDER BY id ASC`, [req.params.id], (err, rows) => res.json(rows || []));
});

app.post('/api/events/:id/comments', (req, res) => {
    const { user, text } = req.body;
    const timestamp = new Date().toISOString();
    db.run(`INSERT INTO event_comments (eventId, user, text, timestamp) VALUES (?, ?, ?, ?)`, 
    [req.params.id, user, text, timestamp], function(err) {
        res.json({ success: true, id: this.lastID });
    });
});

const PORT = process.env.PORT || 5000;

// AI Q&A Endpoint for Videos
app.post('/api/videos/:id/ask', async (req, res) => {
    const { question } = req.body;
    const videoId = req.params.id;

    if (!OPENROUTER_API_KEY) {
        return res.status(500).json({ answer: "AI service is unavailable. For more queries contact this number - 9677914980" });
    }

    try {
        const video = await new Promise((resolve, reject) => {
            db.get("SELECT title, description, llmEnglish FROM videos WHERE videoId = ?", [videoId], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (!video) {
            return res.status(404).json({ answer: "Video not found. For more queries contact this number - 9677914980" });
        }

        const context = `Title: ${video.title}\nDescription: ${video.description}\nAI Summary: ${video.llmEnglish}`;
        
        const systemPrompt = `You are a helpful and spiritual assistant. You must answer the user's question based ONLY on the provided video contextual information. 
If the given context does not contain the answer, or if you are unsure, you MUST reply EXACTLY with: 'For more queries contact this number - 9677914980'. Do not invent answers.`;

        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "google/gemini-2.5-flash:free",
            max_tokens: 1000,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Context:\n${context}\n\nQuestion: ${question}` }
            ]
        }, {
            headers: { "Authorization": `Bearer ${OPENROUTER_API_KEY}`, "Content-Type": "application/json" }
        });

        const answer = response.data.choices[0].message.content.trim();
        res.json({ answer });

    } catch (error) {
        console.error("Q&A Error:", error.message);
        res.status(500).json({ answer: "For more queries contact this number - 9677914980" });
    }
});

app.listen(PORT, () => { console.log(`🚀 Advanced AI Backend running at http://localhost:${PORT}`); });

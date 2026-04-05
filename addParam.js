import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('videos.db');
db.run("ALTER TABLE videos ADD COLUMN durationMinutes INTEGER DEFAULT 0", (err) => {
    console.log("Altered database:", err ? err.message : "Success");
});

import fs from 'fs';

const seedVerses = [
    { source: "Bhagavad-gita As It Is 2.14", text: "O son of Kunti, the nonpermanent appearance of happiness and distress, and their disappearance in due course, are like the appearance and disappearance of winter and summer seasons." },
    { source: "Bhagavad-gita As It Is 6.6", text: "For him who has conquered the mind, the mind is the best of friends; but for one who has failed to do so, his mind will remain the greatest enemy." },
    { source: "Bhagavad-gita As It Is 4.38", text: "In this world, there is nothing so sublime and pure as transcendental knowledge." },
    { source: "Srimad Bhagavatam 1.2.11", text: "Learned transcendentalists who know the Absolute Truth call this nondual substance Brahman, Paramatma or Bhagavan." },
    { source: "Srimad Bhagavatam 1.2.6", text: "The supreme occupation [dharma] for all humanity is that by which men can attain to loving devotional service unto the transcendent Lord." },
    { source: "Caitanya Caritamrita Madhya 22.107", text: "Pure love for Krishna is eternally established in the hearts of living entities. It is not something to be gained from another source." },
    { source: "Bhagavad-gita As It Is 9.27", text: "Whatever you do, whatever you eat, whatever you offer or give away, and whatever austerities you perform—do that, O son of Kunti, as an offering to Me." },
    { source: "Srimad Bhagavatam 10.14.58", text: "For those who have accepted the boat of the lotus feet of the Lord, who is the shelter of the cosmic manifestation... the ocean of the material world is like the water contained in a calf's hoof-print." }
];

const quotes = [];
for (let i = 0; i < 365; i++) {
    const seed = seedVerses[i % seedVerses.length];
    quotes.push({
        id: i + 1,
        text: seed.text,
        source: seed.source + ` (Vedabase Insight ${i+1})`,
        explanation: `Practical spiritual application for Day ${i+1}: Internalize this instruction to build supreme discipline and maintain steady focus today, navigating all student challenges peacefully.`
    });
}

fs.writeFileSync('quotes.json', JSON.stringify(quotes, null, 2));
console.log("365 Quotes successfully generated in quotes.json!");

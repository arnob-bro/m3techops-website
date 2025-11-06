

const db = require("../config/database");

// SQL (included directly in JS)
const sql = `
CREATE TABLE IF NOT EXISTS careers (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  vacancies INTEGER NOT NULL,
  description TEXT NOT NULL,
  send_to VARCHAR(200) NOT NULL,
  status VARCHAR(50) DEFAULT 'Open',
  deadline DATE NOT NULL,
  posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

`;

(async () => {
  try {
    console.log("⏳ Running career table migration...");
    await db.query(sql);
    console.log("✅ Career table created and sample data inserted successfully.");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  }
})();

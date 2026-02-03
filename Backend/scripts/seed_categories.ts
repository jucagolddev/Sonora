import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";

// Load .env
dotenv.config({ path: path.join(__dirname, "../.env") });

const CATEGORIES = [
  "Cinematic",
  "Horror",
  "Sci-Fi",
  "Ambient",
  "Foley",
  "Vocals",
  "Percussion",
  "Synth",
  "Orchestral",
  "Electronic",
  "Rock",
  "Pop",
  "Jazz",
  "Blues",
  "Classical",
  "Hip Hop",
  "Reggae",
  "Country",
  "Folk",
  "Latin",
  "Metal",
  "Punk",
  "Soul",
  "R&B",
  "Funk",
  "Disco",
  "Techno",
  "House",
  "Trance",
  "Dubstep",
  "Ambient",
];

async function seedCategories() {
  let connection;
  try {
    console.log("Connecting to database...");
    // Create connection (using same params as db.ts but manual to avoid app dependencies)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "sonora",
    });
    console.log("Connected.");

    // Fetch existing categories
    const [rows]: any = await connection.query(
      "SELECT nombre_categoria FROM categorias",
    );
    const existing = new Set(
      rows.map((r: any) => r.nombre_categoria.toLowerCase()),
    );

    let addedCount = 0;
    for (const cat of CATEGORIES) {
      if (!existing.has(cat.toLowerCase())) {
        await connection.query(
          "INSERT INTO categorias (nombre_categoria) VALUES (?)",
          [cat],
        );
        console.log(`Added: ${cat}`);
        addedCount++;
      }
    }

    console.log(`\nSeeding complete. Added ${addedCount} new categories.`);
  } catch (error) {
    console.error("Error seeding categories:", error);
  } finally {
    if (connection) await connection.end();
  }
}

seedCategories();

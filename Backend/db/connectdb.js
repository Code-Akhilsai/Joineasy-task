import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.error("PostgreSQL connection failed:", err.message);
  } else {
    console.log("PostgreSQL connected:", result.rows[0]);
  }
});

export default pool;

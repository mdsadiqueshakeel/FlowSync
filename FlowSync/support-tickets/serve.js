import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Set CORS header for all responses
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Serve static files from dist
app.use(express.static(path.join(__dirname, "dist")));

// Optional: catch-all route for index.html (for debugging)
app.get((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`✅ MFE live at http://localhost:${PORT}`);
});

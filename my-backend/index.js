// backend/index.js
const express = require("express");
const XLSX = require("xlsx");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");

const app = express();

// Enable CORS (allow frontend to connect)
app.use(
  cors({
    origin: "http://localhost:5173", // change if your frontend runs elsewhere
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Configure multer for uploads (files go into /uploads)
const upload = multer({ dest: "uploads/" });

// Endpoint to upload Excel file
app.post("/upload-excel", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Path to uploaded file
    const filePath = path.join(__dirname, req.file.path);

    // Read Excel workbook
    const workbook = XLSX.readFile(filePath);

    // Build an array of { name, data } so the frontend dropdown works
    const sheets = workbook.SheetNames.map((name) => ({
      name,
      data: XLSX.utils.sheet_to_json(workbook.Sheets[name], {
        raw: false, // parse values (incl. dates)
        dateNF: "yyyy-mm-dd", // date format
      }),
    }));

    // Optional: clean up uploaded temp file
    fs.unlink(filePath, () => {});

    // Send JSON response that matches your frontend
    res.json({
      message: "File uploaded successfully",
      sheets,
    });
  } catch (err) {
    console.error("Error processing Excel file:", err);
    res.status(500).json({ error: "Failed to process Excel file" });
  }
});

// Start server
app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});

// backend/index.js
const express = require("express");
const XLSX = require("xlsx");
const path = require("path");
const multer = require("multer");
const cors = require("cors");

const app = express();

// Enable CORS (allow frontend to connect)
app.use(
  cors({
    origin: "http://localhost:5173", // change to 3000 if using CRA
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

    // Read Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Send JSON response
    res.json({ message: "File uploaded successfully", data });
  } catch (err) {
    console.error("Error processing Excel file:", err);
    res.status(500).json({ error: "Failed to process Excel file" });
  }
});

// Start server
app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});

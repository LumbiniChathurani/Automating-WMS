const express = require("express");
const XLSX = require("xlsx");
const path = require("path");
const multer = require("multer");

const app = express();

// Configure multer for uploads
const upload = multer({ dest: "uploads/" }); // uploaded files will be saved in /uploads

// Endpoint to upload Excel file
app.post("/upload-excel", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Get the uploaded file path
    const filePath = path.join(__dirname, req.file.path);

    // Read Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    res.json({ message: "File uploaded successfully", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process Excel file" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

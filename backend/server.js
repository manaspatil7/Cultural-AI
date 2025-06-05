// Required Modules
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'https://cultural-ai-chi.vercel.app',
      'https://cultural-ai-chi.vercel.app/',
      process.env.FRONTEND_URL
    ].filter(Boolean); // Remove any falsy values
    
    // Remove trailing slashes and compare
    const normalizedOrigin = origin.replace(/\/$/, '');
    const normalizedAllowed = allowedOrigins.map(url => url.replace(/\/$/, ''));
    
    if (normalizedAllowed.includes(normalizedOrigin)) {
      return callback(null, true);
    }
    
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Environment Variables
const MESHY_API_KEY = process.env.MESHY_API_KEY;
const MESHY_API_ENDPOINT = "https://api.meshy.ai/openapi/v1/image-to-3d";
const GOOGLE_GEN_AI_KEY = process.env.GOOGLE_GEN_AI_KEY;
const PHOTAI_API_KEY = process.env.PHOTAI_API_KEY;
const PHOTAI_API_URL = "https://prodapi.phot.ai/external/api/v3/user_activity/old-photos-restore-2k";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Google Generative AI Initialization
const genAI = new GoogleGenerativeAI(GOOGLE_GEN_AI_KEY);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Route: Artifact Analysis
app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const imagePath = path.join(__dirname, req.file.path);
    const image = {
      inlineData: {
        data: Buffer.from(fs.readFileSync(imagePath)).toString("base64"),
        mimeType: "image/jpeg",
      },
    };

    const prompt = `Artifact Recognition: \n
      1. Identify its name, origin, and cultural context.\n
      2. Analyze the artifact for localized cultural information based on its specific region of origin.\n
      3. Estimate the artifact's age and provide a probability of its authenticity, including verification for any potential counterfeit indicators.`;

    const result = await model.generateContent([
      { text: prompt },
      image,
    ]);

    res.json({ result: result.response.text() });
  } catch (error) {
    console.error("Error analyzing image:", error);
    res.status(500).json({ error: "Error analyzing the image" });
  }
});

// Route: 3D Model Conversion
// Route: 3D Model Conversion (updated to handle both image URL and file upload)
app.post("/api/convert", upload.single("image"), async (req, res) => {
  let imageUrl = req.body.image_url;
  let imageFile = req.file;

  // If no image URL is provided, use the uploaded image
  if (!imageUrl && !imageFile) {
    return res.status(400).json({ error: "Image URL or image file is required" });
  }

  // If an image URL is provided, use it
  if (imageUrl) {
    imageUrl = imageUrl;
  } else if (imageFile) {
    // Upload image file to Cloudinary
    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(imageFile.path, {
        folder: "image-uploads",
      });
      imageUrl = cloudinaryResponse.secure_url;
    } catch (error) {
      console.error("Error uploading file:", error);
      return res.status(500).json({ error: "Failed to upload image file" });
    }
  }

  const headers = { Authorization: `Bearer ${MESHY_API_KEY}` };
  const payload = {
    image_url: imageUrl,
    enable_pbr: true,
    should_remesh: true,
    should_texture: true,
  };

  try {
    const response = await axios.post(MESHY_API_ENDPOINT, payload, { headers });
    res.json({ taskId: response.data.result });
  } catch (error) {
    console.error("Error initiating conversion:", error.message);
    res.status(500).json({ error: "Failed to initiate 3D model conversion" });
  }
});


// Route: Fetch 3D Model Result
app.get("/api/result/:taskId", async (req, res) => {
  const { taskId } = req.params;

  const headers = { Authorization: `Bearer ${MESHY_API_KEY}` };
  try {
    const response = await axios.get(`${MESHY_API_ENDPOINT}/${taskId}`, { headers });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching result:", error.message);
    res.status(500).json({ error: "Failed to fetch 3D model result" });
  }
});

// Route: Image Reconstruction
app.post("/reconstruct", upload.single("image"), async (req, res) => {
  try {
    const { color_flag } = req.body;

    // Upload image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "reconstructed_images",
    });

    const publicUrl = cloudinaryResponse.secure_url;

    const data = {
      source_url: publicUrl,
      color_flag: color_flag === "true",
    };

    const headers = {
      "x-api-key": PHOTAI_API_KEY,
      "Content-Type": "application/json",
    };

    const response = await axios.post(PHOTAI_API_URL, data, { headers });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error reconstructing image:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || "Failed to reconstruct the image" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});















import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const uploadBuffer = (fileBuffer, mimetype) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "student-qa", resource_type: "auto" },
      (err, result) => err ? reject(err) : resolve(result.secure_url)
    );
    stream.end(fileBuffer);
  });

router.post("/", upload.array("files", 5), async (req, res) => {
  try {
    const urls = await Promise.all((req.files || []).map(f => uploadBuffer(f.buffer, f.mimetype)));
    res.json({ urls });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;

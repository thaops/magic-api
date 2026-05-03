const multer = require("multer");

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
];

// Use memory storage — files stay in buffer, then streamed to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, cb) {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`File type not allowed: ${file.mimetype}`), false);
  },
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
});

module.exports = { upload };

const { Router }                   = require("express");
const path                         = require("path");
const { Media }                    = require("../../models");
const auth                         = require("../../middleware/auth");
const { upload }                   = require("../../middleware/upload");
const { cloudinary, uploadBuffer } = require("../../config/cloudinary");

const router = Router();
router.use(auth);

// ── GET /api/admin/media ────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.folder) filter.folder = req.query.folder;

    const media = await Media.find(filter).sort({ uploadedAt: -1 }).lean();
    res.json(media);
  } catch (err) {
    console.error("[media GET /]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── POST /api/admin/media/upload ────────────────────────────────────────────
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const folder       = req.body?.folder || "misc";
    const file         = req.file;
    const isVideo      = file.mimetype.startsWith("video/");
    const resourceType = isVideo ? "video" : "image";

    // Stream buffer → Cloudinary
    const result = await uploadBuffer(file.buffer, {
      folder:          `magic-popup/${folder}`,
      resource_type:   resourceType,
      use_filename:    false,
      unique_filename: true,
      // Auto compress & convert for images
      ...(isVideo ? {} : { quality: "auto", fetch_format: "auto" }),
    });

    // Video thumbnail: grab frame at 0s, 400×400 crop
    const thumbnailUrl = isVideo
      ? result.secure_url.replace("/upload/", "/upload/so_0,w_400,h_400,c_fill/")
      : null;

    const mediaDoc = await Media.create({
      filename:            path.basename(result.public_id),
      originalName:        file.originalname,
      type:                resourceType,
      mimeType:            file.mimetype,
      url:                 result.secure_url,
      thumbnailUrl,
      cloudinaryPublicId:  result.public_id,
      size:                result.bytes,
      dimensions: {
        width:  result.width  ?? null,
        height: result.height ?? null,
      },
      duration:   isVideo ? (result.duration ?? null) : null,
      folder,
      uploadedBy: req.admin._id,
    });

    res.status(201).json(mediaDoc);
  } catch (err) {
    console.error("[media POST /upload]", err);
    res.status(500).json({ error: err.message || "Upload failed" });
  }
});

// ── PATCH /api/admin/media/:id ──────────────────────────────────────────────
router.patch("/:id", async (req, res) => {
  try {
    const { alt } = req.body;
    if (alt === undefined) return res.status(400).json({ error: "alt is required" });

    const media = await Media.findByIdAndUpdate(req.params.id, { alt }, { new: true }).lean();
    if (!media) return res.status(404).json({ error: "Media not found" });

    res.json(media);
  } catch (err) {
    console.error("[media PATCH /:id]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── DELETE /api/admin/media/:id ─────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ error: "Media not found" });

    // Delete from Cloudinary (non-blocking on error)
    if (media.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(media.cloudinaryPublicId, {
          resource_type: media.type === "video" ? "video" : "image",
        });
      } catch (e) {
        console.warn("[media DELETE] Cloudinary destroy skipped:", e.message);
      }
    }

    await Media.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error("[media DELETE /:id]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

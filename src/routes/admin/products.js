const { Router } = require("express");
const { Product } = require("../../models");
const auth = require("../../middleware/auth");

const router = Router();

// All routes require authentication
router.use(auth);

// GET /api/admin/products — all products sorted by order
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ order: 1 })
      .populate("coverImage", "url thumbnailUrl alt filename")
      .lean();
    res.json(products);
  } catch (err) {
    console.error("[admin/products GET /]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin/products/reorder — must be before /:id routes
router.patch("/reorder", async (req, res) => {
  try {
    const items = req.body; // [{ id, order }]
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "Body must be an array of { id, order }" });
    }

    const ops = items.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order } },
      },
    }));

    await Product.bulkWrite(ops);
    res.json({ success: true });
  } catch (err) {
    console.error("[admin/products PATCH /reorder]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/admin/products — create product
router.post("/", async (req, res) => {
  try {
    const productData = { ...req.body, updatedBy: req.admin._id };
    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (err) {
    console.error("[admin/products POST /]", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin/products/:id — single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("coverImage", "url thumbnailUrl alt filename")
      .populate("media.mediaId", "url thumbnailUrl alt filename type")
      .populate("media.thumbnailId", "url filename")
      .lean();

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("[admin/products GET /:id]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/admin/products/:id — full update
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.admin._id },
      { new: true, runValidators: true }
    ).populate("coverImage", "url thumbnailUrl alt filename");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("[admin/products PUT /:id]", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin/products/:id/media — update only coverImage + media gallery
router.patch("/:id/media", async (req, res) => {
  try {
    const { coverImage, media } = req.body;
    const update = {};
    if (coverImage !== undefined) update.coverImage = coverImage || null;
    if (media      !== undefined) update.media      = media;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    )
      .populate("coverImage",    "url thumbnailUrl alt filename")
      .populate("media.mediaId", "url thumbnailUrl alt filename mimeType type")
      .lean();

    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("[admin/products PATCH /:id/media]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/admin/products/:id — delete product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("[admin/products DELETE /:id]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin/products/:id/visibility — toggle visibility
router.patch("/:id/visibility", async (req, res) => {
  try {
    const { isVisible } = req.body;
    if (typeof isVisible !== "boolean") {
      return res.status(400).json({ error: "isVisible must be a boolean" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isVisible },
      { new: true }
    ).lean();

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("[admin/products PATCH /:id/visibility]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

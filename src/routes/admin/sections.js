const { Router } = require("express");
const { Section } = require("../../models");
const auth = require("../../middleware/auth");

const router = Router();

// All routes require authentication
router.use(auth);

// GET /api/admin/sections — all sections sorted by order
router.get("/", async (req, res) => {
  try {
    const sections = await Section.find().sort({ order: 1 }).lean({ virtuals: true });
    res.json(sections);
  } catch (err) {
    console.error("[admin/sections GET /]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin/sections/:type — single section by type
router.get("/:type", async (req, res) => {
  try {
    const section = await Section.findOne({ type: req.params.type }).lean({ virtuals: true });
    if (!section) {
      return res.status(404).json({ error: "Section not found" });
    }
    res.json(section);
  } catch (err) {
    console.error("[admin/sections GET /:type]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/admin/sections/:type — update section content
router.put("/:type", async (req, res) => {
  try {
    const { type } = req.params;

    const section = await Section.findOne({ type });
    if (!section) {
      return res.status(404).json({ error: "Section not found" });
    }

    // Body is the content object for that type
    section[type] = req.body;
    section.updatedBy = req.admin._id;

    await section.save();

    res.json(section.toJSON());
  } catch (err) {
    console.error("[admin/sections PUT /:type]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin/sections/:type/visibility — toggle visibility
router.patch("/:type/visibility", async (req, res) => {
  try {
    const { isVisible } = req.body;
    if (typeof isVisible !== "boolean") {
      return res.status(400).json({ error: "isVisible must be a boolean" });
    }

    const section = await Section.findOneAndUpdate(
      { type: req.params.type },
      { isVisible },
      { new: true }
    ).lean({ virtuals: true });

    if (!section) {
      return res.status(404).json({ error: "Section not found" });
    }

    res.json(section);
  } catch (err) {
    console.error("[admin/sections PATCH /:type/visibility]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

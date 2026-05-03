const { Router } = require("express");
const { SiteConfig } = require("../../models");
const auth = require("../../middleware/auth");

const router = Router();

// All routes require authentication
router.use(auth);

// Helper: get or create singleton
async function getSingleton() {
  let config = await SiteConfig.findOne({ _key: "main" });
  if (!config) {
    config = await SiteConfig.create({ _key: "main" });
  }
  return config;
}

// GET /api/admin/site-config — get singleton
router.get("/", async (req, res) => {
  try {
    const config = await getSingleton();
    res.json(config);
  } catch (err) {
    console.error("[admin/siteConfig GET /]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin/site-config/navigation — partial update navigation
router.patch("/navigation", async (req, res) => {
  try {
    const config = await SiteConfig.findOneAndUpdate(
      { _key: "main" },
      { $set: { navigation: req.body, updatedBy: req.admin._id } },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(config);
  } catch (err) {
    console.error("[admin/siteConfig PATCH /navigation]", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin/site-config/contact — partial update contact
router.patch("/contact", async (req, res) => {
  try {
    const config = await SiteConfig.findOneAndUpdate(
      { _key: "main" },
      { $set: { contact: req.body, updatedBy: req.admin._id } },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(config);
  } catch (err) {
    console.error("[admin/siteConfig PATCH /contact]", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin/site-config/footer — partial update footer
router.patch("/footer", async (req, res) => {
  try {
    const config = await SiteConfig.findOneAndUpdate(
      { _key: "main" },
      { $set: { footer: req.body, updatedBy: req.admin._id } },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(config);
  } catch (err) {
    console.error("[admin/siteConfig PATCH /footer]", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin/site-config/seo — partial update seo
router.patch("/seo", async (req, res) => {
  try {
    const config = await SiteConfig.findOneAndUpdate(
      { _key: "main" },
      { $set: { seo: req.body, updatedBy: req.admin._id } },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(config);
  } catch (err) {
    console.error("[admin/siteConfig PATCH /seo]", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

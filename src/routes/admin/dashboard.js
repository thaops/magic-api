const { Router } = require("express");
const { Product, ContactSubmission, Section } = require("../../models");
const auth = require("../../middleware/auth");

const router = Router();

// GET /api/admin/dashboard/stats — aggregated stats
router.get("/stats", auth, async (req, res) => {
  try {
    const [
      productsTotal,
      productsVisible,
      contactsNew,
      contactsTotal,
      sectionsVisible,
      sectionsTotal,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isVisible: true }),
      ContactSubmission.countDocuments({ status: "new" }),
      ContactSubmission.countDocuments(),
      Section.countDocuments({ isVisible: true }),
      Section.countDocuments(),
    ]);

    res.json({
      products: {
        total: productsTotal,
        visible: productsVisible,
      },
      contacts: {
        new: contactsNew,
        total: contactsTotal,
      },
      sections: {
        visible: sectionsVisible,
        total: sectionsTotal,
      },
    });
  } catch (err) {
    console.error("[admin/dashboard GET /stats]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

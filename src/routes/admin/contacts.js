const { Router } = require("express");
const { ContactSubmission } = require("../../models");
const auth = require("../../middleware/auth");

const router = Router();

// All routes require authentication
router.use(auth);

const VALID_STATUSES = ["new", "read", "replied", "archived"];

// GET /api/admin/contacts — list all submissions, sorted by submittedAt desc
// Supports ?status= filter
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      if (!VALID_STATUSES.includes(req.query.status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` });
      }
      filter.status = req.query.status;
    }

    const contacts = await ContactSubmission.find(filter)
      .sort({ submittedAt: -1 })
      .populate("productInterest", "name slug")
      .lean();

    res.json(contacts);
  } catch (err) {
    console.error("[admin/contacts GET /]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin/contacts/:id — single submission
router.get("/:id", async (req, res) => {
  try {
    const contact = await ContactSubmission.findById(req.params.id)
      .populate("productInterest", "name slug")
      .lean();

    if (!contact) {
      return res.status(404).json({ error: "Contact submission not found" });
    }

    res.json(contact);
  } catch (err) {
    console.error("[admin/contacts GET /:id]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin/contacts/:id/status — update status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` });
    }

    const update = { status };

    // Auto-set timestamps
    if (status === "read") {
      update.readAt = new Date();
    } else if (status === "replied") {
      update.repliedAt = new Date();
    }

    const contact = await ContactSubmission.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    ).lean();

    if (!contact) {
      return res.status(404).json({ error: "Contact submission not found" });
    }

    res.json(contact);
  } catch (err) {
    console.error("[admin/contacts PATCH /:id/status]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin/contacts/:id/note — update admin note
router.patch("/:id/note", async (req, res) => {
  try {
    const { adminNote } = req.body;
    if (adminNote === undefined) {
      return res.status(400).json({ error: "adminNote is required" });
    }

    const contact = await ContactSubmission.findByIdAndUpdate(
      req.params.id,
      { adminNote },
      { new: true }
    ).lean();

    if (!contact) {
      return res.status(404).json({ error: "Contact submission not found" });
    }

    res.json(contact);
  } catch (err) {
    console.error("[admin/contacts PATCH /:id/note]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

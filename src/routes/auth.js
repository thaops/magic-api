const { Router } = require("express");
const jwt = require("jsonwebtoken");
const { Admin } = require("../models");
const auth = require("../middleware/auth");

const router = Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // passwordHash has select:false — explicitly select it
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select("+passwordHash");
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!admin.isActive) {
      return res.status(401).json({ error: "Account is inactive" });
    }

    const valid = await admin.verifyPassword(password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Update lastLoginAt
    admin.lastLoginAt = new Date();
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("[auth/login]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/auth/me
router.get("/me", auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.json({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      avatar: admin.avatar,
      isActive: admin.isActive,
      lastLoginAt: admin.lastLoginAt,
      createdAt: admin.createdAt,
    });
  } catch (err) {
    console.error("[auth/me]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

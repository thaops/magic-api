const jwt = require("jsonwebtoken");
const { Admin } = require("../models");

async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.slice(7);

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const admin = await Admin.findById(payload.id).select("+passwordHash");
    if (!admin) {
      return res.status(401).json({ error: "Admin not found" });
    }

    if (!admin.isActive) {
      return res.status(401).json({ error: "Account is inactive" });
    }

    req.admin = admin;
    next();
  } catch (err) {
    console.error("[auth middleware]", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = auth;

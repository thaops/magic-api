require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connect } = require("./config/database");

const app = express();

// CORS — allow configured origins or all in development
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : [];

app.use(cors({
  origin: allowedOrigins.length > 0
    ? (origin, cb) => {
        // Allow requests with no origin (mobile apps, curl, server-to-server)
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`CORS: origin ${origin} not allowed`));
      }
    : true,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// Public routes
app.use("/api/landing", require("./routes/landing"));

// Auth routes
app.use("/api/auth", require("./routes/auth"));

// Admin routes (all protected by auth middleware internally)
app.use("/api/admin/sections",    require("./routes/admin/sections"));
app.use("/api/admin/products",    require("./routes/admin/products"));
app.use("/api/admin/site-config", require("./routes/admin/siteConfig"));
app.use("/api/admin/contacts",    require("./routes/admin/contacts"));
app.use("/api/admin/media",       require("./routes/admin/media"));
app.use("/api/admin/dashboard",   require("./routes/admin/dashboard"));

const PORT = process.env.PORT || 4000;

connect().then(() => {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
});

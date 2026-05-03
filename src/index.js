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

// Health check + wake-up ping (no auth, public)
app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/ping",   (_req, res) => res.send("pong"));

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

// Validate required env vars before starting
const REQUIRED_VARS = ["MONGODB_URI", "JWT_SECRET"];
const missing = REQUIRED_VARS.filter(k => !process.env[k]);
if (missing.length > 0) {
  console.error(`[startup] Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}

const PORT = process.env.PORT || 4000;

connect()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`API running on port ${PORT}`)
    );
  })
  .catch(err => {
    console.error("[startup] MongoDB connection failed:", err.message);
    process.exit(1);
  });

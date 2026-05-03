const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["superadmin", "editor"], default: "editor" },
    avatar: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Hash password trước khi lưu
adminSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

adminSchema.methods.verifyPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

module.exports = model("Admin", adminSchema);

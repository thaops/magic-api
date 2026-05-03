const { Schema, model, Types } = require("mongoose");

// Lịch sử mọi thay đổi do admin thực hiện
const auditLogSchema = new Schema(
  {
    action:     { type: String, enum: ["create", "update", "delete"], required: true },
    targetCollection: { type: String, required: true }, // tên collection bị thay đổi
    documentId: { type: Types.ObjectId, required: true },
    field:      { type: String, default: null },       // field cụ thể bị thay đổi
    before:     { type: Schema.Types.Mixed, default: null },
    after:      { type: Schema.Types.Mixed, default: null },
    performedBy:{ type: Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: { createdAt: "performedAt", updatedAt: false } }
);

auditLogSchema.index({ targetCollection: 1, documentId: 1 });
auditLogSchema.index({ performedAt: -1 });
auditLogSchema.index({ performedBy: 1 });

module.exports = model("AuditLog", auditLogSchema);

const { Schema, model, Types } = require("mongoose");

const contactSubmissionSchema = new Schema(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, trim: true, lowercase: true },
    phone:   { type: String, default: "" },
    message: { type: String, required: true },

    // Sản phẩm khách hàng quan tâm (tuỳ chọn)
    productInterest: { type: Types.ObjectId, ref: "Product", default: null },

    // Kênh liên hệ
    channel: { type: String, enum: ["email", "messenger", "form"], default: "form" },

    // Trạng thái xử lý
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
    },

    // Ghi chú nội bộ của admin
    adminNote: { type: String, default: "" },

    // Tracking
    readAt:    { type: Date, default: null },
    repliedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: "submittedAt", updatedAt: false } }
);

contactSubmissionSchema.index({ status: 1 });
contactSubmissionSchema.index({ submittedAt: -1 });

module.exports = model("ContactSubmission", contactSubmissionSchema);

const { Schema, model, Types } = require("mongoose");

// Media item trong gallery của sản phẩm
const productMediaSchema = new Schema(
  {
    mediaId: { type: Types.ObjectId, ref: "Media", required: true },
    thumbnailId: { type: Types.ObjectId, ref: "Media", default: null }, // chỉ dùng cho video
    type: { type: String, enum: ["image", "video"], required: true },
    alt: { type: String, default: "" },
    order: { type: Number, required: true },
  },
  { _id: false }
);

// Thông số kỹ thuật kiểu [label, value]
const specSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    order: { type: Number, required: true },
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },

    // Ảnh bìa hiển thị trên grid (null khi chưa upload lên cloud)
    coverImage: { type: Types.ObjectId, ref: "Media", default: null },

    // Kích thước ô trong masonry grid
    gridSize: { type: String, enum: ["sm", "md", "lg"], default: "sm" },

    // Mô tả ngắn hiển thị trên card
    description: { type: String, required: true },

    // Mô tả dài hiển thị trong modal
    longDescription: { type: String, default: "" },

    // Thông số kỹ thuật
    specs: { type: [specSchema], default: [] },

    // Gallery ảnh/video trong modal
    media: { type: [productMediaSchema], default: [] },

    // Tags để lọc và tìm kiếm sau này
    tags: { type: [String], default: [] },

    isVisible: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },

    // Thứ tự hiển thị trong grid
    order: { type: Number, required: true },

    updatedBy: { type: Types.ObjectId, ref: "Admin", default: null },
  },
  { timestamps: true }
);

productSchema.index({ order: 1 });
productSchema.index({ isVisible: 1, order: 1 });
productSchema.index({ category: 1 });

module.exports = model("Product", productSchema);

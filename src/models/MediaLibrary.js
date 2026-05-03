const { Schema, model, Types } = require("mongoose");

const mediaSchema = new Schema(
  {
    filename:          { type: String, required: true },
    originalName:      { type: String, required: true },
    type:              { type: String, enum: ["image", "video"], required: true },
    mimeType:          { type: String, required: true },
    url:               { type: String, required: true },       // Cloudinary secure_url
    thumbnailUrl:      { type: String, default: null },
    cloudinaryPublicId:{ type: String, default: null },        // for deletion
    size:              { type: Number, required: true },        // bytes
    dimensions: {
      width:  { type: Number, default: null },
      height: { type: Number, default: null },
    },
    duration:    { type: Number, default: null },  // seconds, video only
    alt:         { type: String, default: "" },
    folder:      { type: String, default: "misc" }, // "products" | "sections" | "misc"
    uploadedBy:  { type: Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: { createdAt: "uploadedAt", updatedAt: false } }
);

mediaSchema.index({ type: 1 });
mediaSchema.index({ folder: 1 });
mediaSchema.index({ uploadedAt: -1 });

module.exports = model("Media", mediaSchema);

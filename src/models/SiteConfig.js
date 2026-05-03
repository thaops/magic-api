const { Schema, model, Types } = require("mongoose");

// Cấu hình toàn site: nav, footer, liên hệ, SEO
// Chỉ có đúng 1 document trong collection này (singleton)

const navLinkSchema = new Schema(
  {
    label:  { type: String, required: true },
    href:   { type: String, required: true },
    order:  { type: Number, required: true },
  },
  { _id: false }
);

const siteConfigSchema = new Schema(
  {
    // Dùng key cố định để đảm bảo singleton
    _key: { type: String, default: "main", unique: true },

    seo: {
      title:       { type: String, default: "Kinetic Paper Studio — Thiệp 3D thủ công Hà Nội" },
      description: { type: String, default: "" },
      keywords:    { type: [String], default: [] },
      ogImage:     { type: Types.ObjectId, ref: "Media", default: null },
    },

    navigation: {
      logoText:   { type: String, default: "Phước" },
      logoAccent: { type: String, default: " design 3d" },
      links:      { type: [navLinkSchema], default: [] },
      ctaButton: {
        label: { type: String, default: "Đặt thiệp" },
        href:  { type: String, default: "#lien-he" },
      },
    },

    contact: {
      email:           { type: String, default: "hello@kineticpaper.studio" },
      messengerUrl:    { type: String, default: "" },
      instagramHandle: { type: String, default: "@kineticpaper.studio" },
      instagramUrl:    { type: String, default: "" },
      location:        { type: String, default: "Hà Nội, Việt Nam" },
    },

    footer: {
      copyright: { type: String, default: "© Kinetic Paper Studio · Thiệp 3D thủ công" },
      tagline:   { type: String, default: "Thiết kế và làm tay tại Hà Nội" },
    },

    updatedBy: { type: Types.ObjectId, ref: "Admin", default: null },
  },
  { timestamps: true }
);

module.exports = model("SiteConfig", siteConfigSchema);

const { Schema, model, Types } = require("mongoose");

// ──────────────────────────────────────────────
// Sub-schemas cho từng loại section
// ──────────────────────────────────────────────

const ctaButtonSchema = new Schema(
  {
    label: { type: String, required: true },
    href:  { type: String, required: true },
    variant: { type: String, enum: ["primary", "secondary", "ghost"], default: "primary" },
  },
  { _id: false }
);

// Section: hero
const heroContentSchema = new Schema(
  {
    badge:         { type: String, default: "" },
    headingMain:   { type: String, required: true },
    headingItalic: { type: String, default: "" },
    description:   { type: String, default: "" },
    primaryCta:    { type: ctaButtonSchema, default: null },
    secondaryCta:  { type: ctaButtonSchema, default: null },
    heroImage:     { type: Types.ObjectId, ref: "Media", default: null },
  },
  { _id: false }
);

// Section: product_collection (chỉ lưu text header, products ở collection riêng)
const productCollectionContentSchema = new Schema(
  {
    badge:         { type: String, default: "" },
    headingMain:   { type: String, required: true },
    headingItalic: { type: String, default: "" },
    description:   { type: String, default: "" },
  },
  { _id: false }
);

// Feature item trong feature_grid
const featureItemSchema = new Schema(
  {
    order: { type: Number, required: true },
    title: { type: String, required: true },
    body:  { type: String, required: true },
  },
  { _id: false }
);

// Section: feature_grid
const featureGridContentSchema = new Schema(
  {
    badge:         { type: String, default: "" },
    headingMain:   { type: String, required: true },
    headingItalic: { type: String, default: "" },
    features:      { type: [featureItemSchema], default: [] },
  },
  { _id: false }
);

// Section: story
const storyContentSchema = new Schema(
  {
    badge:         { type: String, default: "" },
    headingMain:   { type: String, required: true },
    headingItalic: { type: String, default: "" },
    body:          { type: String, default: "" },
    image:         { type: Types.ObjectId, ref: "Media", default: null },
  },
  { _id: false }
);

// Stat item trong about
const statItemSchema = new Schema(
  {
    value: { type: String, required: true },  // "6+", "200+", "100%"
    label: { type: String, required: true },  // "Năm thực hành"
    order: { type: Number, required: true },
  },
  { _id: false }
);

// Section: about
const aboutContentSchema = new Schema(
  {
    badge:         { type: String, default: "" },
    headingMain:   { type: String, required: true },
    headingItalic: { type: String, default: "" },
    bio:           { type: [String], default: [] }, // mỗi phần tử là 1 đoạn văn
    photo:         { type: Types.ObjectId, ref: "Media", default: null },
    stats:         { type: [statItemSchema], default: [] },
  },
  { _id: false }
);

// Section: cta
const ctaSectionContentSchema = new Schema(
  {
    badge:           { type: String, default: "" },
    headingMain:     { type: String, required: true },
    headingItalic:   { type: String, default: "" },
    description:     { type: String, default: "" },
    emailButton:     { type: ctaButtonSchema, default: null },
    messengerButton: { type: ctaButtonSchema, default: null },
    mobileCta:       { type: ctaButtonSchema, default: null },
  },
  { _id: false }
);

// ──────────────────────────────────────────────
// Main Section schema (polymorphic content)
// ──────────────────────────────────────────────

const SECTION_TYPES = ["hero", "product_collection", "feature_grid", "story", "about", "cta"];

const sectionSchema = new Schema(
  {
    type:      { type: String, enum: SECTION_TYPES, required: true, unique: true },
    label:     { type: String, required: true },   // tên dễ đọc cho admin UI
    isVisible: { type: Boolean, default: true },
    order:     { type: Number, required: true },

    // Chỉ một trong các content field được dùng, tuỳ theo type
    hero:               { type: heroContentSchema,               default: null },
    product_collection: { type: productCollectionContentSchema,  default: null },
    feature_grid:       { type: featureGridContentSchema,        default: null },
    story:              { type: storyContentSchema,              default: null },
    about:              { type: aboutContentSchema,              default: null },
    cta:                { type: ctaSectionContentSchema,         default: null },

    updatedBy: { type: Types.ObjectId, ref: "Admin", default: null },
  },
  { timestamps: true }
);

sectionSchema.index({ order: 1 });
sectionSchema.index({ isVisible: 1 });

// Virtual: trả về content của đúng type để API tiện dùng
sectionSchema.virtual("content").get(function () {
  return this[this.type] ?? null;
});

sectionSchema.set("toJSON", { virtuals: true });
sectionSchema.set("toObject", { virtuals: true });

module.exports = model("Section", sectionSchema);

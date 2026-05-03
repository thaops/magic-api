const { Router } = require("express");
const { SiteConfig, Section, Product } = require("../models");

const router = Router();

// Chuyển ObjectId ref thành URL string (null nếu chưa upload)
function mediaUrl(doc) {
  return doc?.url ?? null;
}

// Transform section content: đổi ObjectId image fields → *Url string
function transformSection(type, content) {
  if (!content) return null;
  const c = { ...content };

  if (type === "hero") {
    c.heroImageUrl = mediaUrl(c.heroImage);
    delete c.heroImage;
  } else if (type === "story") {
    c.imageUrl = mediaUrl(c.image);
    delete c.image;
  } else if (type === "about") {
    c.photoUrl = mediaUrl(c.photo);
    delete c.photo;
  }

  return c;
}

// GET /api/landing
router.get("/", async (_req, res) => {
  try {
    const [siteConfig, sections, products] = await Promise.all([
      SiteConfig.findOne({ _key: "main" }).lean(),
      Section.find({ isVisible: true })
        .sort({ order: 1 })
        .populate("hero.heroImage")
        .populate("story.image")
        .populate("about.photo")
        .lean(),
      Product.find({ isVisible: true })
        .sort({ order: 1 })
        .populate("coverImage")
        .populate("media.mediaId")
        .populate("media.thumbnailId")
        .lean(),
    ]);

    // Gom sections → { hero: {...}, about: {...}, ... }
    const sectionsMap = {};
    for (const s of sections) {
      sectionsMap[s.type] = transformSection(s.type, s[s.type]);
    }

    // Transform products
    const transformedProducts = products.map((p) => ({
      id: p._id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      gridSize: p.gridSize,
      description: p.description,
      longDescription: p.longDescription,
      specs: (p.specs ?? []).sort((a, b) => a.order - b.order),
      coverImageUrl: mediaUrl(p.coverImage),
      media: (p.media ?? [])
        .sort((a, b) => a.order - b.order)
        .map((m) => ({
          type: m.type,
          url: mediaUrl(m.mediaId),
          thumbnailUrl: mediaUrl(m.thumbnailId),
          alt: m.alt,
          order: m.order,
        })),
      order: p.order,
    }));

    res.json({
      siteConfig: siteConfig
        ? {
            navigation: siteConfig.navigation,
            contact: siteConfig.contact,
            footer: siteConfig.footer,
          }
        : null,
      sections: sectionsMap,
      products: transformedProducts,
    });
  } catch (err) {
    console.error("[landing]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

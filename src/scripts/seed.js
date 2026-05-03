require("dotenv").config();
const mongoose = require("mongoose");
const { connect } = require("../config/database");
const { Admin, SiteConfig, Section, Product } = require("../models");

async function seed() {
  await connect();

  // ── Admin mặc định ──────────────────────────
  const existing = await Admin.findOne({ email: "admin@kineticpaper.studio" });
  if (!existing) {
    await Admin.create({
      name: "Phước",
      email: "admin@kineticpaper.studio",
      passwordHash: "Admin@123456",  // sẽ được hash tự động bởi pre-save hook
      role: "superadmin",
    });
    console.log("✓ Admin created");
  }

  // ── SiteConfig ───────────────────────────────
  await SiteConfig.findOneAndUpdate(
    { _key: "main" },
    {
      seo: {
        title: "Kinetic Paper Studio — Thiệp 3D thủ công Hà Nội",
        description: "Thiệp 3D pop-up handmade tại Hà Nội. Thiết kế riêng cho đám cưới, sinh nhật, kỷ niệm.",
        keywords: ["thiệp 3D", "pop-up card", "thiệp handmade", "Hà Nội"],
      },
      navigation: {
        logoText: "Phước",
        logoAccent: " design 3d",
        links: [
          { label: "Bộ sưu tập", href: "#bo-suu-tap", order: 1 },
          { label: "Câu chuyện",  href: "#cau-chuyen",  order: 2 },
          { label: "Về tôi",      href: "#ve-toi",      order: 3 },
          { label: "Liên hệ",     href: "#lien-he",     order: 4 },
        ],
        ctaButton: { label: "Đặt thiệp", href: "#lien-he" },
      },
      contact: {
        email: "hello@kineticpaper.studio",
        messengerUrl: "",
        instagramHandle: "@kineticpaper.studio",
        instagramUrl: "",
        location: "Hà Nội, Việt Nam",
      },
      footer: {
        copyright: "© Kinetic Paper Studio · Thiệp 3D thủ công",
        tagline: "Thiết kế và làm tay tại Hà Nội",
      },
    },
    { upsert: true, new: true }
  );
  console.log("✓ SiteConfig seeded");

  // ── Sections ─────────────────────────────────
  const sections = [
    {
      type: "hero",
      label: "Hero Section",
      order: 1,
      hero: {
        badge: "Thiệp 3D thủ công · Studio Kinetic Paper",
        headingMain: "Mở ra một khoảnh khắc.",
        headingItalic: "Gấp gọn một câu chuyện.",
        description: "Mỗi tấm thiệp là một công trình giấy được cắt và gấp thủ công. Không phải một món quà — mà là một khoảnh khắc được giữ lại.",
        primaryCta:  { label: "Xem bộ sưu tập",      href: "#bo-suu-tap", variant: "primary" },
        secondaryCta:{ label: "Về người làm thiệp →", href: "#ve-toi",     variant: "ghost" },
      },
    },
    {
      type: "product_collection",
      label: "Bộ sưu tập",
      order: 2,
      product_collection: {
        badge: "Bộ sưu tập",
        headingMain: "Sáu thiết kế.",
        headingItalic: "Sáu khoảnh khắc.",
        description: "Nhấn vào từng mẫu để xem ảnh chi tiết và video mở thiệp. Mỗi mẫu được phác thảo, cắt và gấp hoàn toàn bằng tay tại studio.",
      },
    },
    {
      type: "feature_grid",
      label: "Cách tôi làm thiệp",
      order: 3,
      feature_grid: {
        badge: "Cách tôi làm thiệp",
        headingMain: "Ba quyết định nhỏ",
        headingItalic: "tạo nên cảm xúc lớn.",
        features: [
          { order: 1, title: "Cắt thủ công",  body: "Mỗi đường nét được cắt và kiểm tra bằng tay. Không có hai tấm thiệp nào hoàn toàn giống nhau." },
          { order: 2, title: "Cấu trúc 3D",   body: "Cơ chế gấp dựa trên lực căng của giấy — không cần keo dán cho phần chuyển động chính." },
          { order: 3, title: "Giấy cao cấp",  body: "Sử dụng giấy bông không acid, định lượng 300–350gsm, giữ form lâu và lên ảnh đẹp." },
        ],
      },
    },
    {
      type: "story",
      label: "Story Section",
      order: 4,
      story: {
        badge: "Một khoảnh khắc, không phải một tấm thiệp",
        headingMain: "Đây không chỉ là một tấm thiệp.",
        headingItalic: "Đây là khoảnh khắc ở lại.",
        body: "Thiệp được thiết kế để có thể đứng độc lập. Sau khi dịp đặc biệt qua đi, nó vẫn ở đó — như một bức điêu khắc nhỏ trên kệ sách, giữ lại lời nhắn ban đầu.",
      },
    },
    {
      type: "about",
      label: "Về tôi",
      order: 5,
      about: {
        badge: "Về tôi",
        headingMain: "Tôi cắt giấy",
        headingItalic: "để giữ lại khoảnh khắc.",
        bio: [
          "Xin chào, mình là người sáng lập của Kinetic Paper Studio. Mình bắt đầu với một con dao rọc giấy, một tấm cotton trắng và niềm tin rằng những món quà đẹp nhất là những món quà có thể mở ra.",
          "Trong sáu năm qua, mình đã thiết kế hơn 200 mẫu thiệp 3D — từ những cánh bướm mỏng manh đến cả một góc phố cổ thu nhỏ. Mỗi tấm thiệp đều được phác thảo, cắt và gấp hoàn toàn bằng tay tại studio nhỏ ở Hà Nội.",
          "Mình tin rằng một tấm thiệp tốt không cần phải nói nhiều. Nó chỉ cần được mở ra — và để khoảnh khắc tự kể câu chuyện của nó.",
        ],
        stats: [
          { value: "6+",   label: "Năm thực hành", order: 1 },
          { value: "200+", label: "Mẫu thiết kế",  order: 2 },
          { value: "100%", label: "Làm thủ công",  order: 3 },
        ],
      },
    },
    {
      type: "cta",
      label: "Liên hệ & Đặt thiệp",
      order: 6,
      cta: {
        badge: "Nhận đặt thiệp & thiết kế riêng",
        headingMain: "Cùng làm một tấm thiệp",
        headingItalic: "cho khoảnh khắc của bạn.",
        description: "Mình nhận đặt theo bộ sưu tập có sẵn hoặc thiết kế riêng cho đám cưới, sinh nhật, kỷ niệm và quà tặng doanh nghiệp. Hãy nhắn cho mình một lời nhắn ngắn — mình sẽ trả lời trong 24 giờ.",
        emailButton:     { label: "Gửi email cho mình",  href: "mailto:hello@kineticpaper.studio", variant: "primary" },
        messengerButton: { label: "Nhắn qua Messenger",  href: "#",                                variant: "ghost" },
        mobileCta:       { label: "Đặt thiệp ngay",      href: "#lien-he",                         variant: "primary" },
      },
    },
  ];

  for (const s of sections) {
    await Section.findOneAndUpdate({ type: s.type }, s, { upsert: true, new: true });
  }
  console.log("✓ Sections seeded (6 sections)");

  // ── Products ─────────────────────────────────
  // Lưu ý: coverImage và media.mediaId cần ObjectId thật sau khi upload ảnh.
  // Seed này chỉ tạo dữ liệu text, ảnh sẽ được gán qua admin UI sau.
  const products = [
    {
      slug: "morpho",
      name: "Morpho — Bươm bướm 3D",
      category: "Sưu tầm",
      gridSize: "lg",
      description: "Tác phẩm tiêu biểu của studio. Đôi cánh được cắt laser với độ chính xác 0.05mm, tự bung khi mở thiệp.",
      longDescription: "Toàn bộ cấu trúc dựa vào lực căng của chính tờ giấy — không keo, không khung. Khi thiệp mở đúng 90°, đôi cánh tự bung và khoá chặt vào không gian ba chiều, mô phỏng nhịp đập cánh của loài Morpho xanh.",
      specs: [
        { label: "Chất liệu", value: "Giấy bông Gmund", order: 1 },
        { label: "Khớp gấp", value: "14 điểm động",     order: 2 },
        { label: "Độ cắt",   value: "0.05 mm",           order: 3 },
        { label: "Kích thước",value: "A6 gấp · A4 mở",  order: 4 },
      ],
      tags: ["bướm", "sưu tầm", "featured"],
      isFeatured: true,
      order: 1,
    },
    {
      slug: "rose",
      name: "Bông hồng đơn",
      category: "Tình yêu",
      gridSize: "sm",
      description: "Một đoá hồng giấy nở dần khi thiệp mở, dành cho ngày kỷ niệm.",
      longDescription: "Cánh hồng được tạo hình từ 24 lớp giấy mỏng, ghép theo đường xoắn ốc Fibonacci. Khi mở thiệp, hoa nở chậm rãi như một thước phim quay chậm.",
      specs: [
        { label: "Chất liệu", value: "Giấy lụa Nhật",          order: 1 },
        { label: "Số cánh",   value: "24 lớp",                  order: 2 },
        { label: "Kích thước",value: "A6 gấp",                  order: 3 },
        { label: "Màu sắc",   value: "Hồng phấn · Đỏ rượu",    order: 4 },
      ],
      tags: ["hoa hồng", "tình yêu", "kỷ niệm"],
      order: 2,
    },
    {
      slug: "city",
      name: "Phố cổ Hà Nội",
      category: "Quê hương",
      gridSize: "md",
      description: "Mô hình kiến trúc giấy nhiều lớp, gợi nhớ những mái ngói rêu phong.",
      longDescription: "Năm lớp giấy chồng nhau tái hiện một con phố nhỏ Hà Nội — từ mái ngói, ban công sắt đến cây bàng mùa thu. Mỗi chi tiết được cắt thủ công và lắp khít vào nhau.",
      specs: [
        { label: "Chất liệu", value: "Giấy mỹ thuật",   order: 1 },
        { label: "Số lớp",    value: "5 lớp",            order: 2 },
        { label: "Kích thước",value: "A5 gấp",           order: 3 },
        { label: "Chủ đề",    value: "Phố cổ · Mùa thu", order: 4 },
      ],
      tags: ["Hà Nội", "kiến trúc", "quê hương"],
      order: 3,
    },
    {
      slug: "wedding",
      name: "Vòm cưới trắng",
      category: "Cưới hỏi",
      gridSize: "sm",
      description: "Nhà thờ và vòm hoa cắt thủ công, gửi lời chúc cho ngày trọng đại.",
      longDescription: "Vòm hoa và đôi nhẫn vàng được dập nổi tinh xảo. Có thể cá nhân hoá tên cô dâu chú rể và ngày cưới ở mặt trong.",
      specs: [
        { label: "Chất liệu",   value: "Giấy ngà · ép kim", order: 1 },
        { label: "Cá nhân hoá", value: "Tên · ngày cưới",   order: 2 },
        { label: "Kích thước",  value: "A5 gấp",             order: 3 },
        { label: "Phong cách",  value: "Cổ điển",            order: 4 },
      ],
      tags: ["đám cưới", "lễ cưới", "cặp đôi"],
      order: 4,
    },
    {
      slug: "birthday",
      name: "Bánh sinh nhật bốn tầng",
      category: "Sinh nhật",
      gridSize: "sm",
      description: "Bánh giấy nhiều tầng cùng nến lung linh, niềm vui bật ra ngay khi mở.",
      longDescription: "Bốn tầng bánh xếp chồng tự bung khi mở thiệp. Có thể viết lời chúc và tên người nhận lên dải băng phía trước.",
      specs: [
        { label: "Chất liệu",   value: "Giấy màu pastel",  order: 1 },
        { label: "Số tầng",     value: "4 tầng + nến",     order: 2 },
        { label: "Cá nhân hoá", value: "Tên · lời chúc",   order: 3 },
        { label: "Kích thước",  value: "A6 gấp",            order: 4 },
      ],
      tags: ["sinh nhật", "bánh", "vui vẻ"],
      order: 5,
    },
    {
      slug: "christmas",
      name: "Ngôi làng tuyết",
      category: "Lễ hội",
      gridSize: "md",
      description: "Rừng thông và ngôi làng nhỏ phủ tuyết, mang mùa đông vào trong tay bạn.",
      longDescription: "Bảy lớp giấy tạo chiều sâu cho ngôi làng phủ tuyết, kết hợp lớp phủ kim tuyến tinh tế gợi cảm giác tuyết rơi dưới ánh đèn.",
      specs: [
        { label: "Chất liệu", value: "Giấy trắng · phủ kim tuyến", order: 1 },
        { label: "Số lớp",    value: "7 lớp",                      order: 2 },
        { label: "Kích thước",value: "A5 gấp",                     order: 3 },
        { label: "Mùa",       value: "Giáng sinh · Năm mới",       order: 4 },
      ],
      tags: ["giáng sinh", "lễ hội", "mùa đông"],
      order: 6,
    },
  ];

  for (const p of products) {
    await Product.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, new: true });
  }
  console.log("✓ Products seeded (6 products)");

  console.log("\n🎉 Seed hoàn thành!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

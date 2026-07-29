import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bkfwoubhonatgpvabzky.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_mu-Qs18ZqKMjr0XbhNHcbQ_1X34136w";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const PRODUCTS = [
  {
    id: "akw-001",
    sku: "AKW-M-POLO-01",
    barcode: "8901234567890",
    name: "Texvalley Signature Pima Polo T-Shirt",
    slug: "texvalley-signature-pima-polo-tshirt",
    category: "t-shirts",
    gender: "Men",
    brand: "Anushka Knits",
    price: 1299,
    original_price: 2499,
    is_new_arrival: true,
    is_trending: true,
    is_best_seller: true,
    is_export_surplus: false,
    rating: 4.9,
    review_count: 128,
    stock: 45,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Obsidian Black", hex: "#111111" },
      { name: "Champagne Gold", hex: "#C8A24D" },
      { name: "Pure White", hex: "#FFFFFF" },
      { name: "Navy Blue", hex: "#0F172A" }
    ],
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80"
    ],
    short_description: "Crafted from 100% Long-Staple Pima Cotton with double-lacoste knit texture for ultimate breathability.",
    description: "Designed for modern elegance, the Texvalley Signature Pima Polo T-Shirt combines unmatched softness with structure.",
    fabric_specs: {
      material: "100% Supima Combed Cotton",
      knitType: "Piqué / Double Lacoste Knit",
      weight: "220 GSM Heavyweight",
      careInstructions: ["Machine wash cold"],
      origin: "Texvalley Global Market, Erode, India"
    },
    size_guide: [
      { size: "S", chest: '38"', length: '27"', shoulder: '16.5"' },
      { size: "M", chest: '40"', length: '28"', shoulder: '17.5"' },
      { size: "L", chest: '42"', length: '29"', shoulder: '18.5"' }
    ],
    reviews: [
      {
        id: "rev-1",
        userName: "Karthik Raja",
        rating: 5,
        date: "2026-06-14",
        comment: "Exceptional quality knit polo! Fabric feels premium.",
        verified: true
      }
    ]
  },
  {
    id: "akw-002",
    sku: "AKW-W-TOP-02",
    barcode: "8901234567891",
    name: "Luxury Ribbed Cashmere Touch Knit Top",
    slug: "luxury-ribbed-cashmere-touch-knit-top",
    category: "tops",
    gender: "Women",
    brand: "Texvalley Luxe",
    price: 1499,
    original_price: 2999,
    is_new_arrival: true,
    is_trending: true,
    is_best_seller: true,
    is_export_surplus: false,
    rating: 4.8,
    review_count: 94,
    stock: 28,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Cream Beige", hex: "#F5F5DC" },
      { name: "Onyx Black", hex: "#111111" }
    ],
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80"
    ],
    short_description: "Ultra-soft fine gauge rib knit top with subtle mock collar for effortlessly stylish layering.",
    description: "An essential silhouette for modern women. Crafted with cloud-like viscose-cotton blend.",
    fabric_specs: {
      material: "70% Viscose, 30% Fine Cotton Knit",
      weight: "180 GSM"
    },
    size_guide: [{ size: "M", chest: '36"', length: '25"', shoulder: '15"' }],
    reviews: []
  },
  {
    id: "akw-003",
    sku: "AKW-EXP-03",
    barcode: "8901234567892",
    name: "European Brand Export Surplus Oversized Heavy Hoodie",
    slug: "european-brand-export-surplus-oversized-heavy-hoodie",
    category: "export-surplus",
    gender: "Unisex",
    brand: "European Surplus",
    price: 1799,
    original_price: 4999,
    is_new_arrival: false,
    is_trending: true,
    is_best_seller: true,
    is_export_surplus: true,
    rating: 5.0,
    review_count: 210,
    stock: 12,
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Charcoal Heather", hex: "#333333" }],
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80"
    ],
    short_description: "Authentic 400 GSM French Terry European export surplus hoodie with double-layer hood.",
    description: "Limited stock direct from global export quota surplus!",
    fabric_specs: { material: "100% Organic Heavyweight French Terry Cotton", weight: "400 GSM" },
    size_guide: [{ size: "L", chest: '48"', length: '30"', shoulder: '23"' }],
    reviews: []
  },
  {
    id: "akw-004",
    sku: "AKW-K-SET-04",
    barcode: "8901234567893",
    name: "Organic Soft Knit Kids Lounge Set (2-Piece)",
    slug: "organic-soft-knit-kids-lounge-set",
    category: "kids-wear",
    gender: "Kids",
    brand: "Anushka Knits",
    price: 899,
    original_price: 1699,
    is_new_arrival: true,
    is_trending: false,
    is_best_seller: false,
    is_export_surplus: false,
    rating: 4.9,
    review_count: 45,
    stock: 35,
    sizes: ["2-3Y", "4-5Y", "6-7Y"],
    colors: [{ name: "Mustard Gold", hex: "#E1AD01" }],
    images: [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1000&q=80"
    ],
    short_description: "GOTS-certified 100% combed cotton jersey set designed for gentle skin.",
    description: "Softness that children love and durability parents trust.",
    fabric_specs: { material: "100% GOTS Certified Combed Cotton", weight: "180 GSM" },
    size_guide: [{ size: "4-5Y", chest: '26"', length: '17"', shoulder: '11"' }],
    reviews: []
  },
  {
    id: "akw-005",
    sku: "AKW-INN-05",
    barcode: "8901234567894",
    name: "Ultra-Soft Micro-Modal Stretch Trunk (Pack of 3)",
    slug: "ultra-soft-micro-modal-stretch-trunk-pack-of-3",
    category: "innerwear",
    gender: "Men",
    brand: "Nordic Basics",
    price: 799,
    original_price: 1499,
    is_new_arrival: false,
    is_trending: false,
    is_best_seller: true,
    is_export_surplus: false,
    rating: 4.9,
    review_count: 312,
    stock: 80,
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Onyx Pack", hex: "#111111" }],
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80"
    ],
    short_description: "Silky modal stretch fabric with no-ride-up leg design.",
    description: "3x softer than cotton! Engineered with micro-modal jersey knit.",
    fabric_specs: { material: "93% Austrian Micro-Modal, 7% Elastane", weight: "160 GSM" },
    size_guide: [{ size: "M", chest: '32-34"', length: '9.5"', shoulder: 'N/A' }],
    reviews: []
  }
];

const CATEGORIES = [
  { id: "t-shirts", name: "T-Shirts & Polos", slug: "t-shirts", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80", description: "Tailored Pima polo t-shirts.", item_count: 52, is_special: false },
  { id: "shirts", name: "Shirts", slug: "shirts", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80", description: "Linen-blend knit shirts.", item_count: 38, is_special: false },
  { id: "tops", name: "Tops & Cardigans", slug: "tops", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80", description: "Fine gauge rib knit tops & cardigans.", item_count: 46, is_special: false },
  { id: "hoodies", name: "Hoodies & Jackets", slug: "hoodies", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80", description: "Heavyweight French terry hoodies.", item_count: 34, is_special: false },
  { id: "export-surplus", name: "Export Surplus", slug: "export-surplus", image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80", description: "Authentic international luxury brand stock.", item_count: 65, is_special: true },
  { id: "kids-wear", name: "Kids Wear", slug: "kids-wear", image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80", description: "100% combed cotton rompers.", item_count: 34, is_special: false },
  { id: "innerwear", name: "Innerwear & Nightwear", slug: "innerwear", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80", description: "Micro-modal trunks & briefs.", item_count: 29, is_special: false }
];

const COUPONS = [
  { code: "WELCOME10", discount_percent: 10, min_amount: 499, description: "10% OFF on your first purchase" },
  { code: "EXPORT20", discount_percent: 20, min_amount: 1999, description: "Flat 20% OFF on Export Surplus collection" },
  { code: "TEXVALLEY15", discount_percent: 15, min_amount: 999, description: "15% Texvalley Store Special" }
];

async function seedDatabase() {
  console.log("🚀 Seeding Supabase database at:", supabaseUrl);

  try {
    // 1. Seed Categories
    console.log("📦 Upserting Categories...");
    const { error: catErr } = await supabase.from("categories").upsert(CATEGORIES);
    if (catErr) console.error("Categories Seed Warning:", catErr.message);
    else console.log("✅ Categories loaded successfully!");

    // 2. Seed Coupons
    console.log("🏷️ Upserting Coupons...");
    const { error: coupErr } = await supabase.from("coupons").upsert(COUPONS);
    if (coupErr) console.error("Coupons Seed Warning:", coupErr.message);
    else console.log("✅ Coupons loaded successfully!");

    // 3. Seed Products
    console.log("👕 Upserting Products...");
    const { error: prodErr } = await supabase.from("products").upsert(PRODUCTS);
    if (prodErr) console.error("Products Seed Warning:", prodErr.message);
    else console.log("✅ Products loaded successfully!");

    console.log("🎉 Database loading process completed!");
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}

seedDatabase();

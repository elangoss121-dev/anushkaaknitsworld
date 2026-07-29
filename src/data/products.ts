export interface ProductReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  slug: string;
  category:
    | "t-shirts"
    | "shirts"
    | "tops"
    | "hoodies"
    | "dresses"
    | "trousers"
    | "export-surplus"
    | "innerwear"
    | "kids-wear"
    | "accessories";
  gender: "Men" | "Women" | "Kids" | "Unisex";
  brand: "Anushka Knits" | "Texvalley Luxe" | "European Surplus" | "Nordic Basics";
  price: number;
  originalPrice: number;
  isNewArrival?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isExportSurplus?: boolean;
  rating: number;
  reviewCount: number;
  stock: number;
  sizes: string[];
  colors: { name: string; hex: string }[];
  images: string[];
  videoUrl?: string;
  shortDescription: string;
  description: string;
  fabricSpecs: {
    material: string;
    knitType: string;
    weight: string;
    careInstructions: string[];
    origin: string;
  };
  sizeGuide: { size: string; chest: string; length: string; shoulder: string }[];
  frequentlyBoughtTogetherIds?: string[];
  reviews: ProductReview[];
}

export const PRODUCTS: Product[] = [
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
    originalPrice: 2499,
    isNewArrival: true,
    isTrending: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 128,
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
    shortDescription: "Crafted from 100% Long-Staple Pima Cotton with double-lacoste knit texture for ultimate breathability.",
    description: "Designed for modern elegance, the Texvalley Signature Pima Polo T-Shirt combines unmatched softness with structure. Engineered in Erode using state-of-the-art Italian knitting technology, this polo features anti-pilling treatment, a reinforced ribbed collar, and genuine mother-of-pearl buttons.",
    fabricSpecs: {
      material: "100% Supima Combed Cotton",
      knitType: "Piqué / Double Lacoste Knit",
      weight: "220 GSM Heavyweight",
      careInstructions: ["Machine wash cold with like colors", "Tumble dry low", "Warm iron if needed", "Do not bleach"],
      origin: "Texvalley Global Market, Erode, India"
    },
    sizeGuide: [
      { size: "S", chest: '38"', length: '27"', shoulder: '16.5"' },
      { size: "M", chest: '40"', length: '28"', shoulder: '17.5"' },
      { size: "L", chest: '42"', length: '29"', shoulder: '18.5"' },
      { size: "XL", chest: '44"', length: '30"', shoulder: '19.5"' },
      { size: "XXL", chest: '46"', length: '31"', shoulder: '20.5"' }
    ],
    frequentlyBoughtTogetherIds: ["akw-005", "akw-011"],
    reviews: [
      {
        id: "rev-1",
        userName: "Karthik Raja",
        rating: 5,
        date: "2026-06-14",
        comment: "Exceptional quality knit polo! The fabric feels premium just like international luxury brands. Buying 2 more colors.",
        verified: true
      },
      {
        id: "rev-2",
        userName: "Siddharth V.",
        rating: 5,
        date: "2026-05-20",
        comment: "Perfect fit and finish. Direct buying from Texvalley Erode online is super smooth.",
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
    originalPrice: 2999,
    isNewArrival: true,
    isTrending: true,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 94,
    stock: 28,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Cream Beige", hex: "#F5F5DC" },
      { name: "Onyx Black", hex: "#111111" },
      { name: "Dusty Rose", hex: "#D8A7B1" }
    ],
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "Ultra-soft fine gauge rib knit top with subtle mock collar for effortlessly stylish layering.",
    description: "An essential silhouette for modern women. Crafted with cloud-like viscose-cotton blend that contours gracefully without clinging. Lightweight, breathable, and designed for day-to-night versatility.",
    fabricSpecs: {
      material: "70% Viscose, 30% Fine Cotton Knit",
      knitType: "2x2 Fine Rib",
      weight: "180 GSM Light Luxury",
      careInstructions: ["Hand wash cold recommended", "Dry flat in shade", "Cool iron on reverse"],
      origin: "Erode Knits Division, Tamil Nadu"
    },
    sizeGuide: [
      { size: "XS", chest: '32"', length: '23"', shoulder: '14"' },
      { size: "S", chest: '34"', length: '24"', shoulder: '14.5"' },
      { size: "M", chest: '36"', length: '25"', shoulder: '15"' },
      { size: "L", chest: '38"', length: '26"', shoulder: '15.5"' },
      { size: "XL", chest: '40"', length: '27"', shoulder: '16"' }
    ],
    frequentlyBoughtTogetherIds: ["akw-006", "akw-008"],
    reviews: [
      {
        id: "rev-3",
        userName: "Ananya Sharma",
        rating: 5,
        date: "2026-07-02",
        comment: "So flattering! The ribbing holds its shape perfectly after washing.",
        verified: true
      }
    ]
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
    originalPrice: 4999,
    isExportSurplus: true,
    isTrending: true,
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 210,
    stock: 12,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Charcoal Heather", hex: "#333333" },
      { name: "Sage Green", hex: "#87A96B" },
      { name: "Sand Tan", hex: "#C2B280" }
    ],
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "Authentic 400 GSM French Terry European export surplus hoodie with double-layer hood.",
    description: "Limited stock direct from global export quota surplus! Made with high-density 400 GSM organic cotton loopback French Terry. Features drop shoulders, deep kangaroo pouch, custom matte eyelets, and heavy ribbed cuffs.",
    fabricSpecs: {
      material: "100% Organic Heavyweight French Terry Cotton",
      knitType: "Loopback French Terry",
      weight: "400 GSM Ultra-Heavyweight",
      careInstructions: ["Wash inside out", "Cold machine wash", "Do not tumble dry"],
      origin: "Export Factory Surplus, Texvalley Erode"
    },
    sizeGuide: [
      { size: "S", chest: '44"', length: '28"', shoulder: '21"' },
      { size: "M", chest: '46"', length: '29"', shoulder: '22"' },
      { size: "L", chest: '48"', length: '30"', shoulder: '23"' },
      { size: "XL", chest: '50"', length: '31"', shoulder: '24"' }
    ],
    frequentlyBoughtTogetherIds: ["akw-001", "akw-005"],
    reviews: [
      {
        id: "rev-4",
        userName: "Meherwan S.",
        rating: 5,
        date: "2026-06-29",
        comment: "This is genuine Zara/H&M export quality! Heavy, cozy, and worth every rupee.",
        verified: true
      }
    ]
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
    originalPrice: 1699,
    isNewArrival: true,
    rating: 4.9,
    reviewCount: 45,
    stock: 35,
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"],
    colors: [
      { name: "Mustard Gold", hex: "#E1AD01" },
      { name: "Sky Blue", hex: "#87CEEB" },
      { name: "Soft Mint", hex: "#98FF98" }
    ],
    images: [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "GOTS-certified 100% combed cotton jersey set designed for gentle skin and endless play.",
    description: "Softness that children love and durability parents trust. Made with azo-free organic dyes and flat-lock smooth seams to prevent scratchiness.",
    fabricSpecs: {
      material: "100% GOTS Certified Combed Cotton",
      knitType: "Single Jersey",
      weight: "180 GSM",
      careInstructions: ["Gentle machine wash", "Do not dry clean"],
      origin: "Texvalley Kids Division, Erode"
    },
    sizeGuide: [
      { size: "2-3Y", chest: '24"', length: '15"', shoulder: '10"' },
      { size: "4-5Y", chest: '26"', length: '17"', shoulder: '11"' },
      { size: "6-7Y", chest: '28"', length: '19"', shoulder: '12"' }
    ],
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
    originalPrice: 1499,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 312,
    stock: 80,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Onyx / Navy / Grey Pack", hex: "#111111" }
    ],
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "Silky modal stretch fabric with no-ride-up leg design and ultra-soft metallic waistband.",
    description: "3x softer than cotton! Engineered with micro-modal jersey knit that wicks moisture instantly and provides 4-way elastic comfort.",
    fabricSpecs: {
      material: "93% Austrian Micro-Modal, 7% Elastane",
      knitType: "Fine Gauge Stretch Jersey",
      weight: "160 GSM",
      careInstructions: ["Machine wash 30°C", "Tumble dry low"],
      origin: "Anushka Innerwear Plant, Erode"
    },
    sizeGuide: [
      { size: "S", chest: '28-30"', length: '9"', shoulder: 'N/A' },
      { size: "M", chest: '32-34"', length: '9.5"', shoulder: 'N/A' },
      { size: "L", chest: '36-38"', length: '10"', shoulder: 'N/A' }
    ],
    reviews: []
  },
  {
    id: "akw-006",
    sku: "AKW-W-CARD-06",
    barcode: "8901234567895",
    name: "Texvalley Gold Button Knit Cardigan Sweater",
    slug: "texvalley-gold-button-knit-cardigan-sweater",
    category: "tops",
    gender: "Women",
    brand: "Anushka Knits",
    price: 1999,
    originalPrice: 3999,
    isNewArrival: true,
    isTrending: true,
    rating: 4.9,
    reviewCount: 67,
    stock: 18,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Midnight Onyx", hex: "#111111" },
      { name: "Vanilla Cream", hex: "#FFFDD0" },
      { name: "Emerald Green", hex: "#046307" }
    ],
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1516762689617-e1cffffd478d?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "Structured waffle-knit cardigan accented with bespoke gold lion head buttons.",
    description: "An instant high-fashion icon. Elevate jeans, trousers, or dresses with this statement gold-accented heavy knit cardigan.",
    fabricSpecs: {
      material: "80% Soft Acrylic Knit, 20% Cotton",
      knitType: "Waffle Texture Knit",
      weight: "320 GSM Heavy Cardigan",
      careInstructions: ["Dry clean recommended", "Hand wash cold"],
      origin: "Texvalley Global Market, Erode"
    },
    sizeGuide: [
      { size: "S", chest: '36"', length: '22"', shoulder: '15"' },
      { size: "M", chest: '38"', length: '23"', shoulder: '15.5"' },
      { size: "L", chest: '40"', length: '24"', shoulder: '16"' }
    ],
    reviews: []
  },
  {
    id: "akw-007",
    sku: "AKW-M-CREW-07",
    barcode: "8901234567896",
    name: "Classic Heavyweight Cotton Crewneck Sweater",
    slug: "classic-heavyweight-cotton-crewneck-sweater",
    category: "hoodies",
    gender: "Men",
    brand: "Anushka Knits",
    price: 1399,
    originalPrice: 2799,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 88,
    stock: 32,
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Melange Grey", hex: "#888888" },
      { name: "Olive Green", hex: "#556B2F" },
      { name: "Navy Blue", hex: "#000080" }
    ],
    images: [
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "Versatile minimal crewneck crafted with dense 280 GSM soft combed fleece.",
    description: "Every wardrobe requires a immaculate crewneck sweater. Pre-shrunk and silicon-washed for extraordinary handfeel.",
    fabricSpecs: {
      material: "100% Pure Combed Cotton Fleece",
      knitType: "Fleece Brushed Interior",
      weight: "280 GSM",
      careInstructions: ["Machine wash cold", "Tumble dry low"],
      origin: "Erode Texvalley, Tamil Nadu"
    },
    sizeGuide: [
      { size: "M", chest: '41"', length: '27.5"', shoulder: '18"' },
      { size: "L", chest: '43"', length: '28.5"', shoulder: '19"' }
    ],
    reviews: []
  },
  {
    id: "akw-008",
    sku: "AKW-EXP-08",
    barcode: "8901234567897",
    name: "Export Surplus US Fashion Brand Printed Tee",
    slug: "export-surplus-us-fashion-brand-printed-tee",
    category: "export-surplus",
    gender: "Unisex",
    brand: "European Surplus",
    price: 599,
    originalPrice: 1999,
    isExportSurplus: true,
    isTrending: true,
    rating: 4.9,
    reviewCount: 156,
    stock: 50,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Vintage White", hex: "#FAF0E6" },
      { name: "Washed Black", hex: "#222222" }
    ],
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "Original American brand export surplus tee with puff graphic print.",
    description: "Factory overstock directly sourced from export houses in Erode. High density screen print that never cracks.",
    fabricSpecs: {
      material: "100% Bio-Washed Ring-Spun Cotton",
      knitType: "Single Jersey",
      weight: "200 GSM",
      careInstructions: ["Machine wash cold inside out"],
      origin: "Texvalley Export Hub, Erode"
    },
    sizeGuide: [
      { size: "M", chest: '40"', length: '28"', shoulder: '17.5"' }
    ],
    reviews: []
  }
];

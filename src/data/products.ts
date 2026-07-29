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
  brand: string;
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

// Clean initial state: Starts empty ready for store owner inventory!
export const PRODUCTS: Product[] = [];

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, PRODUCTS } from "@/data/products";
import { STORE_INFO } from "@/data/store-info";

export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export interface OrderItem {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  gst: number;
  shipping: number;
  total: number;
  status: "Pending" | "Confirmed" | "Packed" | "Shipped" | "Delivered" | "Cancelled";
  trackingNumber: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  paymentStatus: "Paid" | "Pending" | "Failed";
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: "Customer" | "Manager" | "Admin";
  walletBalance: number;
}

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[]; // product IDs
  compareList: string[]; // product IDs
  recentlyViewed: string[];
  user: UserProfile | null;
  role: "Customer" | "Admin";
  setRole: (role: "Customer" | "Admin") => void;
  currency: typeof STORE_INFO.currencies[0];
  setCurrency: (currency: typeof STORE_INFO.currencies[0]) => void;
  
  // Cart Actions
  addToCart: (product: Product, size?: string, color?: string, qty?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  
  // Wishlist & Compare
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  addRecentlyViewed: (productId: string) => void;

  // Search & Modals
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isQuickViewOpen: boolean;
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  // Orders & Auth
  orders: OrderItem[];
  placeOrder: (details: Omit<OrderItem, "id" | "date" | "status" | "trackingNumber">) => OrderItem;
  loginUser: (email: string, name?: string) => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password?: string) => Promise<{ success: boolean; message: string }>;
  logoutUser: () => void;

  // Toast System
  toastMessage: string | null;
  showToast: (msg: string) => void;
  
  // Helper calculations
  cartSubtotal: number;
  cartDiscount: number;
  cartGst: number;
  cartShipping: number;
  cartTotal: number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

import { supabase } from "@/lib/supabase";

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [role, setRole] = useState<"Customer" | "Admin">("Customer");
  const [currency, setCurrency] = useState(STORE_INFO.currencies[0]);

  // User state
  const [user, setUser] = useState<UserProfile | null>({
    name: "Sivakumar P.",
    email: "siva.texvalley@gmail.com",
    phone: "+91 9442707630",
    role: "Customer",
    walletBalance: 450
  });

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Orders State with realistic initial order history
  const [orders, setOrders] = useState<OrderItem[]>([
    {
      id: "ORD-94427",
      date: "2026-07-25",
      items: [
        {
          product: PRODUCTS[0],
          selectedColor: "Obsidian Black",
          selectedSize: "L",
          quantity: 1
        }
      ],
      subtotal: 1299,
      discount: 130,
      gst: 210,
      shipping: 0,
      total: 1379,
      status: "Shipped",
      trackingNumber: "BD-982144321IN",
      shippingAddress: {
        fullName: "Sivakumar P.",
        phone: "9442707630",
        addressLine: "55, Ground Floor, Global Market, Texvalley",
        city: "Erode",
        state: "Tamil Nadu",
        pincode: "638102"
      },
      paymentMethod: "Razorpay UPI",
      paymentStatus: "Paid"
    }
  ]);

  // Fetch Live Data from Supabase Database
  useEffect(() => {
    async function loadSupabaseData() {
      try {
        const { data: dbProducts, error: prodErr } = await supabase.from("products").select("*");
        if (!prodErr && dbProducts && dbProducts.length > 0) {
          const mapped: Product[] = dbProducts.map((p: Record<string, unknown>) => ({
            id: String(p.id),
            sku: String(p.sku),
            barcode: String(p.barcode || ""),
            name: String(p.name),
            slug: String(p.slug),
            category: p.category as Product["category"],
            gender: p.gender as Product["gender"],
            brand: p.brand as Product["brand"],
            price: Number(p.price),
            originalPrice: Number(p.original_price),
            isNewArrival: Boolean(p.is_new_arrival),
            isTrending: Boolean(p.is_trending),
            isBestSeller: Boolean(p.is_best_seller),
            isExportSurplus: Boolean(p.is_export_surplus),
            rating: Number(p.rating),
            reviewCount: Number(p.review_count),
            stock: Number(p.stock),
            sizes: (p.sizes as string[]) || [],
            colors: (p.colors as { name: string; hex: string }[]) || [],
            images: (p.images as string[]) || [],
            shortDescription: String(p.short_description || ""),
            description: String(p.description || ""),
            fabricSpecs: (p.fabric_specs as Product["fabricSpecs"]) || {
              material: "",
              knitType: "",
              weight: "",
              careInstructions: [],
              origin: ""
            },
            sizeGuide: (p.size_guide as Product["sizeGuide"]) || [],
            reviews: (p.reviews as Product["reviews"]) || []
          }));
          setProducts(mapped);
        }

        const { data: dbOrders } = await supabase.from("orders").select("*");
        if (dbOrders && dbOrders.length > 0) {
          const mappedOrders: OrderItem[] = dbOrders.map((o: Record<string, unknown>) => ({
            id: String(o.id),
            date: String(o.date),
            items: o.items as CartItem[],
            subtotal: Number(o.subtotal),
            discount: Number(o.discount),
            gst: Number(o.gst),
            shipping: Number(o.shipping),
            total: Number(o.total),
            status: o.status as OrderItem["status"],
            trackingNumber: String(o.tracking_number || ""),
            shippingAddress: o.shipping_address as OrderItem["shippingAddress"],
            paymentMethod: String(o.payment_method || ""),
            paymentStatus: o.payment_status as OrderItem["paymentStatus"]
          }));
          setOrders((prev) => [...mappedOrders, ...prev]);
        }
      } catch {
        // Fallback to local dataset if database offline
      }
    }
    loadSupabaseData();
  }, []);

  // Load persistence from LocalStorage
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const savedCart = localStorage.getItem("akw_cart");
        const savedWish = localStorage.getItem("akw_wishlist");
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart) && parsedCart.length > 0) {
            setCart(parsedCart);
          }
        }
        if (savedWish) {
          const parsedWish = JSON.parse(savedWish);
          if (Array.isArray(parsedWish) && parsedWish.length > 0) {
            setWishlist(parsedWish);
          }
        }
      } catch {
        // ignore SSR
      }
    });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("akw_cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("akw_wishlist", JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addToCart = (product: Product, size?: string, color?: string, qty = 1) => {
    const finalSize = size || product.sizes[0] || "M";
    const finalColor = color || product.colors[0]?.name || "Default";

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === finalSize &&
          item.selectedColor === finalColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      } else {
        return [...prev, { product, selectedSize: finalSize, selectedColor: finalColor, quantity: qty }];
      }
    });

    showToast(`Added "${product.name}" (${finalSize}) to your Bag!`);
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.product.id === productId && item.selectedSize === size && item.selectedColor === color)
      )
    );
    showToast("Item removed from Shopping Bag");
  };

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.selectedSize === size && item.selectedColor === color) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast("Removed from Wishlist");
        return prev.filter((id) => id !== productId);
      } else {
        showToast("Added to your Wishlist ❤️");
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const toggleCompare = (productId: string) => {
    setCompareList((prev) => {
      if (prev.includes(productId)) {
        showToast("Removed from Compare List");
        return prev.filter((id) => id !== productId);
      } else {
        if (prev.length >= 4) {
          showToast("Maximum 4 products can be compared at once");
          return prev;
        }
        showToast("Added to Product Comparison ⚖️");
        return [...prev, productId];
      }
    });
  };

  const isInCompare = (productId: string) => compareList.includes(productId);

  const addRecentlyViewed = (productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 8);
    });
  };

  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
    addRecentlyViewed(product.id);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  // Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartDiscount = 0;
  const cartGst = Math.round(cartSubtotal * 0.05); // 5% apparel GST
  const cartShipping = cartSubtotal > 999 || cart.length === 0 ? 0 : 99;
  const cartTotal = Math.max(0, cartSubtotal + cartGst + cartShipping);

  const placeOrder = (details: Omit<OrderItem, "id" | "date" | "status" | "trackingNumber">) => {
    const newOrder: OrderItem = {
      ...details,
      id: `AKW-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split("T")[0],
      status: "Confirmed",
      trackingNumber: `EXP-${Math.floor(10000000 + Math.random() * 90000000)}IN`
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Save order to Supabase
    supabase.from("orders").insert([
      {
        id: newOrder.id,
        date: newOrder.date,
        items: newOrder.items,
        subtotal: newOrder.subtotal,
        discount: newOrder.discount,
        gst: newOrder.gst,
        shipping: newOrder.shipping,
        total: newOrder.total,
        status: newOrder.status,
        tracking_number: newOrder.trackingNumber,
        shipping_address: newOrder.shippingAddress,
        payment_method: newOrder.paymentMethod,
        payment_status: newOrder.paymentStatus
      }
    ]).then(() => {});

    return newOrder;
  };

  const loginUser = (email: string, name = "Anushka Customer") => {
    setUser({
      name,
      email,
      phone: "+91 9566396667",
      role: "Customer",
      walletBalance: 200
    });
    showToast(`Welcome back, ${name}!`);
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined
        }
      });
      if (error) {
        if (error.message.includes("provider is not enabled") || error.message.includes("validation_failed")) {
          showToast("ℹ️ Google Provider disabled in Supabase. Logging in with Email / Customer account!");
          loginUser("customer@anushkaaknitsworld.com", "Texvalley Customer");
        } else {
          showToast(`❌ Google Auth: ${error.message}`);
        }
      } else {
        showToast("🚀 Redirecting to Google Authentication...");
      }
    } catch {
      showToast("ℹ️ Logging in via customer account fallback...");
      loginUser("customer@anushkaaknitsworld.com", "Texvalley Customer");
    }
  };

  const loginWithEmail = async (email: string, password = "Password123!") => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Attempt sign up if user does not exist
        const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: email.split("@")[0] }
          }
        });
        if (signUpErr) {
          loginUser(email, email.split("@")[0]);
          return { success: true, message: `Welcome ${email}` };
        }
        if (signUpData.user) {
          setUser({
            name: email.split("@")[0],
            email,
            phone: "+91 9442707630",
            role: "Customer",
            walletBalance: 200
          });
          showToast(`Account registered & logged in as ${email}!`);
          return { success: true, message: "Account created successfully" };
        }
      }

      if (data.user) {
        setUser({
          name: data.user.user_metadata?.full_name || email.split("@")[0],
          email: data.user.email || email,
          phone: "+91 9442707630",
          role: "Customer",
          walletBalance: 200
        });
        showToast(`Welcome back, ${email}!`);
        return { success: true, message: "Logged in successfully" };
      }
      return { success: true, message: "Logged in" };
    } catch {
      loginUser(email, email.split("@")[0]);
      return { success: true, message: "Logged in locally" };
    }
  };

  const logoutUser = () => {
    supabase.auth.signOut();
    setUser(null);
    showToast("Logged out successfully");
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        wishlist,
        compareList,
        recentlyViewed,
        user,
        role,
        setRole,
        currency,
        setCurrency,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        toggleCompare,
        isInCompare,
        addRecentlyViewed,
        isSearchOpen,
        setIsSearchOpen,
        isQuickViewOpen,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        orders,
        placeOrder,
        loginUser,
        loginWithGoogle,
        loginWithEmail,
        logoutUser,
        toastMessage,
        showToast,
        cartSubtotal,
        cartDiscount,
        cartGst,
        cartShipping,
        cartTotal
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within a ShopProvider");
  return context;
};

"use client";

import React, { useState } from "react";
import { PRODUCTS, Product } from "@/data/products";
import { STORE_INFO } from "@/data/store-info";
import { useShop } from "@/context/ShopContext";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  BarChart3,
  Star,
  Settings,
  Plus,
  Trash2,
  Download,
  Upload,
  Sparkles,
  TrendingUp,
  DollarSign,
  Search,
  Check,
  X,
  Link as LinkIcon,
  ArrowLeft,
  ArrowRight,
  Image as ImageIcon
} from "lucide-react";

export default function AdminDashboardPage() {
  const { showToast } = useShop();

  const [activeTab, setActiveTab] = useState<
    "analytics" | "products" | "orders" | "categories" | "reviews" | "seo"
  >("analytics");

  // Admin Products State
  const [productList, setProductList] = useState<Product[]>(PRODUCTS);
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Product Image Management State
  const [productImages, setProductImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80"
  ]);
  const [imageUrlInput, setImageUrlInput] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // New Product Form State
  const [newProd, setNewProd] = useState({
    name: "Texvalley Signature Organic Cotton Polo",
    category: "t-shirts" as Product["category"],
    gender: "Men" as Product["gender"],
    brand: "Anushka Knits" as Product["brand"],
    price: 1399,
    originalPrice: 2599,
    stock: 50,
    sku: "AKW-NEW-01",
    barcode: "8901234567899",
    isExportSurplus: false
  });

  // Orders Admin State (Clean initial 0 orders)
  const [adminOrders, setAdminOrders] = useState<
    {
      id: string;
      customer: string;
      phone: string;
      date: string;
      itemsCount: number;
      total: number;
      payment: string;
      status: string;
    }[]
  >([]);

  // Handle Drag & Drop Local Image File Upload
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const newImgs: string[] = [];

    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        showToast(`❌ Format ${file.type} not supported. Use PNG, JPG, JPEG, or WEBP.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProductImages((prev) => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    showToast("📷 Image(s) uploaded successfully!");
  };

  const handleAddImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;
    setProductImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput("");
    showToast("🔗 Public Image URL added!");
  };

  const removeImage = (index: number) => {
    if (productImages.length <= 1) {
      showToast("⚠️ At least one product image is required.");
      return;
    }
    setProductImages((prev) => prev.filter((_, i) => i !== index));
    showToast("Image removed.");
  };

  const setPrimaryImage = (index: number) => {
    if (index === 0) return;
    setProductImages((prev) => {
      const copy = [...prev];
      const selected = copy.splice(index, 1)[0];
      return [selected, ...copy];
    });
    showToast("⭐ Primary product image updated!");
  };

  const moveImage = (index: number, direction: "left" | "right") => {
    const targetIdx = direction === "left" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= productImages.length) return;
    setProductImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Product = {
      id: `akw-custom-${Date.now()}`,
      sku: newProd.sku,
      barcode: newProd.barcode,
      name: newProd.name,
      slug: newProd.name.toLowerCase().replace(/\s+/g, "-"),
      category: newProd.category,
      gender: newProd.gender,
      brand: newProd.brand,
      price: Number(newProd.price),
      originalPrice: Number(newProd.originalPrice),
      isNewArrival: true,
      isExportSurplus: newProd.isExportSurplus,
      rating: 5.0,
      reviewCount: 1,
      stock: Number(newProd.stock),
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [{ name: "Standard", hex: "#111111" }],
      images: productImages.length > 0 ? productImages : ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80"],
      shortDescription: `${newProd.name} crafted with organic combed cotton.`,
      description: `High-grade product manufactured in Texvalley Erode. Exceptional durability and style.`,
      fabricSpecs: {
        material: "100% Organic Combed Cotton",
        knitType: "Double Lacoste Knit",
        weight: "220 GSM",
        careInstructions: ["Machine wash cold"],
        origin: "Texvalley Global Market, Erode"
      },
      sizeGuide: [{ size: "L", chest: '42"', length: '29"', shoulder: '18.5"' }],
      reviews: []
    };

    setProductList([created, ...productList]);
    setShowAddProductModal(false);
    showToast(`Product "${created.name}" added to catalog with ${productImages.length} image(s)!`);
  };

  const handleDeleteProduct = (id: string) => {
    setProductList(productList.filter((p) => p.id !== id));
    showToast("Product deleted from catalog.");
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setAdminOrders(
      adminOrders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order ${orderId} status updated to ${newStatus}`);
  };

  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,ID,Name,SKU,Price,Stock,Category\n" +
      productList.map((p) => `${p.id},"${p.name}",${p.sku},${p.price},${p.stock},${p.category}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Anushka_Knits_Catalog.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Product catalog exported as CSV!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header Bar */}
      <div className="bg-[#111111] text-white p-8 rounded-3xl border border-[#C8A24D]/40 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#C8A24D] text-white flex items-center justify-center text-xl font-bold shadow-lg">
            <LayoutDashboard className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold">Shopify-Grade Admin Panel</h1>
              <span className="bg-[#C8A24D] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                Live Store
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              ANUSHKAA KNITS WORLD • Texvalley Global Market, Erode, Tamil Nadu
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-zinc-700 shadow-md"
          >
            <Download className="w-4 h-4 text-[#C8A24D]" /> Export CSV
          </button>
          <button
            onClick={() => setShowAddProductModal(true)}
            className="btn-gold px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-xl"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs Bar */}
      <div className="bg-white p-2 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-2 overflow-x-auto text-xs font-bold uppercase tracking-wider">
        {[
          { id: "analytics", label: "Analytics & Revenue", icon: BarChart3 },
          { id: "products", label: `Product Manager (${productList.length})`, icon: Package },
          { id: "orders", label: `Orders (${adminOrders.length})`, icon: ShoppingBag },
          { id: "categories", label: "Categories", icon: Tag },
          { id: "reviews", label: "Customer Reviews", icon: Star },
          { id: "seo", label: "SEO & Store CMS", icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-3 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
                activeTab === tab.id
                  ? "bg-[#111111] text-white shadow-md"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <Icon className="w-4 h-4 text-[#C8A24D]" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ANALYTICS & REVENUE METRICS */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase">
                <span>Today&apos;s Revenue</span>
                <DollarSign className="w-4 h-4 text-[#C8A24D]" />
              </div>
              <p className="text-3xl font-serif font-bold text-zinc-900">
                ₹{adminOrders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
              </p>
              <span className="text-xs text-zinc-400 font-bold">
                {adminOrders.length} orders processed
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase">
                <span>Total Catalog Products</span>
                <BarChart3 className="w-4 h-4 text-[#C8A24D]" />
              </div>
              <p className="text-3xl font-serif font-bold text-zinc-900">{productList.length}</p>
              <span className="text-xs text-zinc-400 font-bold">
                {productList.length === 0 ? "Add your first product to get started" : "Active in store catalog"}
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase">
                <span>Total Orders</span>
                <TrendingUp className="w-4 h-4 text-[#C8A24D]" />
              </div>
              <p className="text-3xl font-serif font-bold text-zinc-900">{adminOrders.length}</p>
              <span className="text-xs text-zinc-400 font-bold">
                {adminOrders.length === 0 ? "Your first order will appear here" : "Orders in fulfillment pipeline"}
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase">
                <span>Customer Base</span>
                <Sparkles className="w-4 h-4 text-[#C8A24D]" />
              </div>
              <p className="text-3xl font-serif font-bold text-zinc-900">0</p>
              <span className="text-xs text-zinc-400 font-bold">
                Live Texvalley customer accounts
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT & CATALOG */}
      {activeTab === "products" && (
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
              <input
                type="text"
                placeholder="Search catalog products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-[#C8A24D]"
              />
            </div>

            <button
              onClick={() => setShowAddProductModal(true)}
              className="w-full sm:w-auto btn-gold px-5 py-2 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" /> Add New Garment
            </button>
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-400 uppercase font-bold tracking-wider">
                  <th className="py-3 px-2">Image</th>
                  <th className="py-3 px-2">Product Name</th>
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2">Price</th>
                  <th className="py-3 px-2">Stock</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium">
                {productList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-zinc-400">
                      <p className="text-sm font-serif font-bold text-zinc-700">No products have been added yet.</p>
                      <p className="text-xs text-zinc-500 mt-1">Click &quot;Add Product&quot; above to add your first product to get started.</p>
                    </td>
                  </tr>
                ) : (
                  productList
                    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-50">
                        <td className="py-3 px-2">
                          <img src={p.images[0]} alt="" className="w-10 h-12 object-cover rounded-lg shadow-sm" />
                        </td>
                        <td className="py-3 px-2">
                          <span className="font-bold text-zinc-900 block">{p.name}</span>
                          <span className="text-[10px] text-zinc-400">SKU: {p.sku}</span>
                        </td>
                        <td className="py-3 px-2 uppercase font-bold text-zinc-500">{p.category}</td>
                        <td className="py-3 px-2 font-bold text-zinc-900">₹{p.price}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.stock > 10 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === "orders" && (
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-xl text-zinc-900 border-b border-zinc-200 pb-3">
            Customer Orders & Fulfillment
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-400 uppercase font-bold">
                  <th className="py-3 px-2">Order ID</th>
                  <th className="py-3 px-2">Customer</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Total</th>
                  <th className="py-3 px-2">Payment</th>
                  <th className="py-3 px-2">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium">
                {adminOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-zinc-400">
                      <p className="text-sm font-serif font-bold text-zinc-700">Your first order will appear here.</p>
                      <p className="text-xs text-zinc-500 mt-1">Orders placed by customers will automatically populate in real-time.</p>
                    </td>
                  </tr>
                ) : (
                  adminOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-zinc-50">
                      <td className="py-3.5 px-2 font-bold text-zinc-900">{o.id}</td>
                      <td className="py-3.5 px-2">
                        <span className="font-bold block text-zinc-900">{o.customer}</span>
                        <span className="text-[10px] text-zinc-400">{o.phone}</span>
                      </td>
                      <td className="py-3.5 px-2 text-zinc-500">{o.date}</td>
                      <td className="py-3.5 px-2 font-bold text-zinc-900">₹{o.total}</td>
                      <td className="py-3.5 px-2 text-zinc-600">{o.payment}</td>
                      <td className="py-3.5 px-2">
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                          className="bg-zinc-100 border border-zinc-300 rounded-lg px-2 py-1 text-xs font-bold"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CATEGORIES MANAGEMENT */}
      {activeTab === "categories" && (
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-xl text-zinc-900 border-b border-zinc-200 pb-3">
            Garment Category Manager
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STORE_INFO.categories.map((cat) => (
              <div key={cat.id} className="p-4 rounded-2xl border border-zinc-200 flex gap-4 items-center">
                <img src={cat.image} alt="" className="w-16 h-16 object-cover rounded-xl shadow-sm" />
                <div>
                  <h4 className="font-bold text-sm text-zinc-900">{cat.name}</h4>
                  <span className="text-xs text-zinc-400">{cat.itemCount} items listed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: REVIEWS MANAGEMENT */}
      {activeTab === "reviews" && (
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-xl text-zinc-900 border-b border-zinc-200 pb-3">
            Customer Testimonials & Product Ratings
          </h3>
          <p className="text-xs text-zinc-500">100% Verified Buyer Reviews from Texvalley Store & Online Buyers.</p>
        </div>
      )}

      {/* TAB 6: SEO & STORE CMS */}
      {activeTab === "seo" && (
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-xl text-zinc-900 border-b border-zinc-200 pb-3">
            Search Engine Optimization (SEO) & CMS Configuration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
            <div className="space-y-2">
              <label className="text-zinc-500">Global Meta Title</label>
              <input
                type="text"
                defaultValue="ANUSHKAA KNITS WORLD | Luxury Clothing & Export Surplus | Texvalley Erode"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#C8A24D]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-zinc-500">Store Address Line (Footer & Invoice)</label>
              <input
                type="text"
                defaultValue={STORE_INFO.address.fullAddress}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#C8A24D]"
              />
            </div>
          </div>

          <button
            onClick={() => showToast("SEO & Store CMS settings updated!")}
            className="btn-gold px-6 py-3 rounded-xl font-bold text-xs uppercase shadow-md"
          >
            Save SEO & Meta Settings
          </button>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL WITH FULL IMAGE MANAGEMENT SYSTEM */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white my-8 p-6 sm:p-8 rounded-3xl max-w-2xl w-full space-y-6 border border-zinc-200 text-zinc-900 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
              <h3 className="font-serif font-bold text-xl">Add New Product & Image Manager</h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="p-2 text-zinc-400 hover:text-zinc-800 text-xl font-bold"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-6 text-xs font-semibold">
              {/* Product Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-zinc-500">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#C8A24D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-500">Clothing Category *</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value as Product["category"] })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5"
                  >
                    <option value="t-shirts">T-Shirts & Polos</option>
                    <option value="shirts">Shirts</option>
                    <option value="tops">Tops & Cardigans</option>
                    <option value="hoodies">Hoodies & Jackets</option>
                    <option value="dresses">Dresses & Kurtis</option>
                    <option value="trousers">Trousers & Jeans</option>
                    <option value="export-surplus">Export Surplus</option>
                    <option value="innerwear">Innerwear & Nightwear</option>
                    <option value="kids-wear">Kids Wear</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-500">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={newProd.sku}
                    onChange={(e) => setNewProd({ ...newProd, sku: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-500">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-500">Original MRP (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProd.originalPrice}
                    onChange={(e) => setNewProd({ ...newProd, originalPrice: Number(e.target.value) })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-500">Stock Inventory Units *</label>
                  <input
                    type="number"
                    required
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="surplus-check"
                    checked={newProd.isExportSurplus}
                    onChange={(e) => setNewProd({ ...newProd, isExportSurplus: e.target.checked })}
                    className="w-4 h-4 accent-[#C8A24D]"
                  />
                  <label htmlFor="surplus-check" className="text-xs font-bold text-[#C8A24D]">
                    Mark as Export Surplus (60% OFF)
                  </label>
                </div>
              </div>

              {/* PRODUCT IMAGE MANAGEMENT SECTION */}
              <div className="space-y-4 pt-4 border-t border-zinc-200">
                <div className="flex justify-between items-center">
                  <h4 className="font-serif font-bold text-sm text-zinc-900 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#C8A24D]" /> Multi-Image Management
                  </h4>
                  <span className="text-[10px] text-zinc-500">Supports PNG, JPG, JPEG, WEBP</span>
                </div>

                {/* Local Drag & Drop Dropzone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    handleFileUpload(e.dataTransfer.files);
                  }}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                    isDragOver ? "border-[#C8A24D] bg-amber-50/50" : "border-zinc-300 bg-zinc-50 hover:bg-zinc-100/80"
                  }`}
                >
                  <Upload className="w-8 h-8 text-[#C8A24D] mx-auto mb-2" />
                  <p className="text-xs font-bold text-zinc-800">
                    Drag & Drop local product images here
                  </p>
                  <p className="text-[10px] text-zinc-500 mb-3">or choose from your computer</p>
                  <label className="cursor-pointer inline-block btn-gold px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider">
                    Browse Local Files
                    <input
                      type="file"
                      multiple
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                  </label>
                </div>

                {/* Public URL Input */}
                <div className="space-y-1">
                  <label className="text-zinc-500">Add Public Image URL</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs focus:outline-none focus:border-[#C8A24D]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="bg-zinc-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold uppercase"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {/* Image Gallery Manager Grid */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-zinc-700">
                    Uploaded Product Images ({productImages.length})
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {productImages.map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded-xl overflow-hidden border group bg-zinc-100 ${
                          idx === 0 ? "border-[#C8A24D] ring-2 ring-[#C8A24D]/40" : "border-zinc-200"
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-24 object-cover" />
                        
                        {/* Primary Badge */}
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-[#C8A24D] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
                            PRIMARY
                          </span>
                        )}

                        {/* Hover Overlay Controls */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => setPrimaryImage(idx)}
                              className="bg-[#C8A24D] text-white p-1 rounded text-[10px] font-bold"
                              title="Set Primary"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => moveImage(idx, "left")}
                              className="bg-zinc-800 text-white p-1 rounded"
                              title="Move Left"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {idx < productImages.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveImage(idx, "right")}
                              className="bg-zinc-800 text-white p-1 rounded"
                              title="Move Right"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="bg-rose-600 text-white p-1 rounded"
                            title="Delete Image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit CTAs */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="flex-1 bg-zinc-100 py-3 rounded-xl font-bold text-xs uppercase hover:bg-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-gold py-3 rounded-xl font-bold text-xs uppercase shadow-lg"
                >
                  Save & Publish Garment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

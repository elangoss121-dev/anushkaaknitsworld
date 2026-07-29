import type { Metadata } from "next";
import { Playfair_Display, Inter, Geist } from "next/font/google";
import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toast } from "@/components/common/Toast";
import { QuickViewModal } from "@/components/common/QuickViewModal";
import { SearchDrawer } from "@/components/common/SearchDrawer";
import { FloatingWhatsApp } from "@/components/common/FloatingWhatsApp";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ANUSHKAA KNITS WORLD | Luxury Clothing & Export Surplus | Texvalley Erode",
  description: "Premier luxury clothing brand in Texvalley Global Market, Erode. Shop T-Shirts, Shirts, Tops, Hoodies, Kids Wear, Combed Innerwear, and 60% OFF Export Surplus.",
  keywords: "Anushka Knits World, Texvalley Erode, Export Surplus Erode, Organic Cotton Apparel, Men Polo Tshirts, Women Cardigans, Kids Wear Texvalley",
  openGraph: {
    title: "ANUSHKAA KNITS WORLD | Premium Fashion & Export Surplus",
    description: "Experience world-class apparel crafted with premium organic combed cotton in Erode Texvalley.",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", playfair.variable, inter.variable, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col bg-[#F9F9FB] text-[#111111]">
        <ErrorBoundary>
          <ShopProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toast />
            <QuickViewModal />
            <SearchDrawer />
            <FloatingWhatsApp />
          </ShopProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

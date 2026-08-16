import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "FOODLY — Krishnagiri",
  description: "Good food. Your way. Order from real Krishnagiri restaurants.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen pb-16 md:pb-0">
        <CartProvider>
          <Header />
          {children}
          <BottomNav />
        </CartProvider>
      </body>
    </html>
  );
}

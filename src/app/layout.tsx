import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { seo, theme } from "@/config/store.config";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  openGraph: {
    title: seo.title,
    description: seo.description,
    images: [{ url: seo.ogImage }],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Build theme CSS variables string from config
  const themeVars = Object.entries(theme)
    .map(([k, v]) => {
      const varName = `--color-${k.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      return `${varName}: ${v};`;
    })
    .join(" ");

  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <style>{`:root { ${themeVars} }`}</style>
      </head>
      <body className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--color-background)", color: "var(--color-foreground)" }}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--color-surface)",
              color: "var(--color-foreground)",
              border: "1px solid var(--color-border)",
              fontSize: "0.875rem",
            },
          }}
        />
      </body>
    </html>
  );
}

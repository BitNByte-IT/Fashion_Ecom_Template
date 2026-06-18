/**
 * ============================================================
 *  STORE CONFIGURATION — Edit this file to customize the store
 * ============================================================
 *  Change brand name, colors, navigation, popup, social links,
 *  Google Sheets URLs, shipping rates, and more — all in one place.
 * ============================================================
 */

import type { NavItem, Category } from "@/types";

// ─── BRAND ───────────────────────────────────────────────────
export const brand = {
  name: "bitNbyteIt",
  orderPrefix: "BB",            // prefix for generated order IDs  e.g. BB-ABC123-XY9Z
  tagline: "Where Style Meets Passion",
  description:
    "Premium fashion for the modern woman. Curated collections that blend elegance with everyday wear.",
  logo: "/images/logo.png", // replace with your logo file
  favicon: "/favicon.ico",
  currency: "৳",
  currencyCode: "BDT",
};

// ─── THEME ───────────────────────────────────────────────────
// These map directly to CSS variables in globals.css
// Change these hex values to retheme the entire site instantly
export const theme = {
  primary: "#C9A96E",       // gold accent — buttons, links, highlights
  primaryHover: "#B8935A",  // slightly darker gold for hover states
  background: "#0A0A0A",    // near black background
  surface: "#141414",       // cards, drawers, modals
  surfaceHover: "#1E1E1E",  // hover state for surface elements
  border: "#2A2A2A",        // subtle border color
  foreground: "#FAFAFA",    // primary text
  muted: "#888888",         // secondary / placeholder text
  danger: "#E05C5C",        // error states
  success: "#4CAF50",       // success states
};

// ─── NAVIGATION ──────────────────────────────────────────────
// Add, remove, or reorder nav items here.
// Children create a dropdown menu.
export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Shop",
    href: "/shop",
    children: [
      { label: "All Products", href: "/shop" },
      { label: "New Arrivals", href: "/shop?tag=new" },
      { label: "Bestsellers", href: "/shop?tag=bestseller" },
      { label: "Sale", href: "/shop?tag=sale" },
    ],
  },
  {
    label: "Collections",
    href: "/shop?category=collections",
    children: [
      { label: "Summer Collection", href: "/shop?category=summer" },
      { label: "Formal Wear", href: "/shop?category=formal" },
      { label: "Casual", href: "/shop?category=casual" },
      { label: "Party Wear", href: "/shop?category=party" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// ─── ANNOUNCEMENT BAR ────────────────────────────────────────
export const announcement = {
  enabled: true,
  messages: [
    "Free shipping on orders above ৳2000",
    "Cash on Delivery available across Bangladesh",
    "New arrivals every Friday — follow us on Instagram",
  ],
};

// ─── FIRST-VISIT POPUP ───────────────────────────────────────
export const popup = {
  enabled: true,
  showDelayMs: 3000,       // delay before showing popup (ms)
  cooldownDays: 7,         // don't show again for X days after close
  heading: "Welcome to Le Reve",
  subheading: "Sign up and get exclusive access to new arrivals, style tips, and special offers.",
  badge: "NEW ARRIVALS ARE HERE",
  image: "https://res.cloudinary.com/dsjlfrzot/image/upload/v1781743207/fashion-store/misc/popup-bg.jpg",
  ctaLabel: "Explore Collection",
  ctaHref: "/shop",
  dismissLabel: "Maybe later",
};

// ─── HERO BANNERS ────────────────────────────────────────────
// Slides through these banners on the home page
export const heroBanners = [
  {
    id: "1",
    heading: "New Summer\nCollection",
    subheading: "Fresh styles for the season",
    ctaLabel: "Shop Now",
    ctaHref: "/shop?tag=new",
    image: "https://res.cloudinary.com/dsjlfrzot/image/upload/v1781743109/fashion-store/heroes/hero-1.jpg",
    align: "left" as const,
  },
  {
    id: "2",
    heading: "Elegance\nRedefined",
    subheading: "Formal wear for every occasion",
    ctaLabel: "Explore Formal",
    ctaHref: "/shop?category=formal",
    image: "https://res.cloudinary.com/dsjlfrzot/image/upload/v1781743111/fashion-store/heroes/hero-2.jpg",
    align: "center" as const,
  },
  {
    id: "3",
    heading: "Sale Up To\n50% Off",
    subheading: "Limited time — don't miss out",
    ctaLabel: "Shop Sale",
    ctaHref: "/shop?tag=sale",
    image: "https://res.cloudinary.com/dsjlfrzot/image/upload/v1781743114/fashion-store/heroes/hero-3.jpg",
    align: "right" as const,
  },
];

// ─── HOMEPAGE CATEGORIES SECTION ─────────────────────────────
export const featuredCategories: Category[] = [
  { name: "Tops & Blouses", slug: "tops",        image: "https://res.cloudinary.com/dsjlfrzot/image/upload/v1781743209/fashion-store/categories/cat-tops.jpg" },
  { name: "Dresses",        slug: "dresses",     image: "https://res.cloudinary.com/dsjlfrzot/image/upload/v1781743127/fashion-store/categories/cat-dresses.jpg" },
  { name: "Bottoms",        slug: "bottoms",     image: "https://res.cloudinary.com/dsjlfrzot/image/upload/v1781743129/fashion-store/categories/cat-bottoms.jpg" },
  { name: "Ethnic Wear",    slug: "ethnic",      image: "https://res.cloudinary.com/dsjlfrzot/image/upload/v1781743131/fashion-store/categories/cat-ethnic.jpg" },
  { name: "Formal",         slug: "formal",      image: "https://res.cloudinary.com/dsjlfrzot/image/upload/v1781743133/fashion-store/categories/cat-formal.jpg" },
  { name: "Accessories",    slug: "accessories", image: "https://res.cloudinary.com/dsjlfrzot/image/upload/v1781743212/fashion-store/categories/cat-accessories.jpg" },
];

// ─── LOOKBOOK / EDITORIAL BANNER ─────────────────────────────
export const lookbook = {
  enabled: true,
  heading: "The Edit",
  subheading: "Styled for the modern woman",
  description:
    "Explore our curated lookbook — real outfits, real style. Find your next favourite look.",
  ctaLabel: "Shop the Look",
  ctaHref: "/shop",
  image: "https://res.cloudinary.com/dsjlfrzot/image/upload/v1781743118/fashion-store/misc/lookbook.jpg",
};

// ─── SHIPPING & COD ──────────────────────────────────────────
export const shipping = {
  insideCity: 60,
  outsideCity: 120,
  freeShippingThreshold: 2000, // 0 to disable
  codAvailable: true,
  codLabel: "Cash on Delivery",
  estimatedDelivery: {
    insideCity: "1-2 business days",
    outsideCity: "3-5 business days",
  },
  divisions: [
    "Dhaka",
    "Chittagong",
    "Rajshahi",
    "Khulna",
    "Barishal",
    "Sylhet",
    "Rangpur",
    "Mymensingh",
  ],
};

// ─── GOOGLE SHEETS INTEGRATION ───────────────────────────────
export const sheets = {
  // Publish your product sheet: File > Share > Publish to web > CSV
  // Paste the published CSV URL here
  productsCSVUrl:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRVVNjbys24YAXqLzKr6DviICdoSmCOPWCjgxIIQwRd_93kfp2URshvkDo141x0srdWItqeZSFb3JXL/pub?gid=495373829&single=true&output=csv",

  // Deploy a Google Apps Script web app to receive orders.
  // See /README-SETUP.md for instructions.
  ordersScriptUrl: "https://script.google.com/macros/s/AKfycbyQZ3TBXNZUwpK-SQCUsF3U9lbe2Q4BdrqhUf7Bu2gkjTgQorhpIiCNl6h-xd9SGsI84Q/exec",
};

// ─── EMAIL (EmailJS) ─────────────────────────────────────────
// Sign up at emailjs.com — free tier is enough
export const emailjs = {
  serviceId: "YOUR_SERVICE_ID",
  templateId: "YOUR_TEMPLATE_ID",   // order confirmation template
  publicKey: "YOUR_PUBLIC_KEY",
  storeEmail: "orders@yourdomain.com", // receives order notifications
};

// ─── CONTACT & SOCIAL ────────────────────────────────────────
export const contact = {
  phone: "+880 1XXX-XXXXXX",
  whatsapp: "+880 1XXX-XXXXXX", // used for WhatsApp link
  email: "hello@yourstore.com",
  address: "House 12, Road 5, Dhanmondi, Dhaka 1205",
  hours: "Saturday – Thursday: 10am – 8pm",
  social: {
    facebook: "https://facebook.com/yourpage",
    instagram: "https://instagram.com/yourpage",
    youtube: "",   // leave empty to hide icon
    tiktok: "",
    pinterest: "",
  },
};

// ─── SEO DEFAULTS ────────────────────────────────────────────
export const seo = {
  title: `${brand.name} — Premium Fashion`,
  description: brand.description,
  ogImage: "/images/og-image.jpg",
  keywords: "fashion, clothing, women fashion, bangladesh, online shop",
};

// ─── FOOTER ──────────────────────────────────────────────────
export const footer = {
  tagline: brand.tagline,
  columns: [
    {
      heading: "Shop",
      links: [
        { label: "All Products", href: "/shop" },
        { label: "New Arrivals", href: "/shop?tag=new" },
        { label: "Bestsellers", href: "/shop?tag=bestseller" },
        { label: "Sale", href: "/shop?tag=sale" },
      ],
    },
    {
      heading: "Help",
      links: [
        { label: "Track My Order", href: "/track-order" },
        { label: "Contact Us", href: "/contact" },
        { label: "About Us", href: "/about" },
        { label: "Shipping Policy", href: "/shipping-policy" },
        { label: "Return Policy", href: "/return-policy" },
      ],
    },
  ],
  bottomNote: `© ${new Date().getFullYear()} ${brand.name}. All rights reserved.`,
};

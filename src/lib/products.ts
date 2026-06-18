import Papa from "papaparse";
import { sheets } from "@/config/store.config";
import { slugify } from "@/lib/utils";
import type { Product } from "@/types";

// ─── Demo products for development ────────────────────────────────────────────
// Replace with real Google Sheets CSV once deployed
const DEMO_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Floral Wrap Dress",
    slug: "floral-wrap-dress",
    price: 1850,
    originalPrice: 2500,
    images: [
      "https://res.cloudinary.com/dsjlfrzot/image/upload/v1781743234/fashion-store/products/product-1.jpg",
      "https://res.cloudinary.com/dsjlfrzot/image/upload/v1781743139/fashion-store/products/product-1b.jpg",
    ],
    category: "dresses",
    description: "A stunning floral wrap dress perfect for summer outings. Made from lightweight chiffon that drapes beautifully.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Rose", "Navy", "Ivory"],
    tags: ["new", "bestseller"],
    inStock: true,
    isNew: true,
    isFeatured: true,
    isBestseller: true,
  },
  {
    id: "2",
    name: "Silk Satin Blouse",
    slug: "silk-satin-blouse",
    price: 1200,
    originalPrice: 1500,
    images: ["https://res.cloudinary.com/dsjlfrzot/image/upload/v1781743141/fashion-store/products/product-2.jpg"],
    category: "tops",
    description: "Luxurious silk satin blouse with a relaxed silhouette. Effortlessly elevates any outfit.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Champagne", "Black", "Dusty Pink"],
    tags: ["bestseller"],
    inStock: true,
    isFeatured: true,
    isBestseller: true,
  },
  {
    id: "3",
    name: "High-Waist Tailored Trousers",
    slug: "high-waist-tailored-trousers",
    price: 1650,
    images: ["https://res.cloudinary.com/dsjlfrzot/image/upload/v1781743236/fashion-store/products/product-3.jpg"],
    category: "bottoms",
    description: "Classic high-waist trousers with a tailored fit. A wardrobe essential for the modern woman.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Camel", "Grey"],
    tags: ["new"],
    inStock: true,
    isNew: true,
    isFeatured: true,
  },
  {
    id: "4",
    name: "Embroidered Kameez Set",
    slug: "embroidered-kameez-set",
    price: 3200,
    originalPrice: 4000,
    images: ["https://res.cloudinary.com/dsjlfrzot/image/upload/v1781743218/fashion-store/products/product-4.jpg"],
    category: "ethnic",
    description: "Elegant embroidered kameez set with intricate threadwork. Perfect for festive occasions.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Teal", "Maroon", "Gold"],
    tags: ["new", "sale"],
    inStock: true,
    isNew: true,
    isFeatured: true,
  },
  {
    id: "5",
    name: "Linen Co-ord Set",
    slug: "linen-coord-set",
    price: 2100,
    images: ["https://res.cloudinary.com/dsjlfrzot/image/upload/v1781743148/fashion-store/products/product-5.jpg"],
    category: "casual",
    description: "Breathable linen co-ord set — blazer and wide-leg trousers sold together. Effortlessly chic.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Beige", "Sage", "White"],
    tags: ["new"],
    inStock: true,
    isNew: true,
  },
  {
    id: "6",
    name: "Ruched Mini Dress",
    slug: "ruched-mini-dress",
    price: 1450,
    originalPrice: 1800,
    images: ["https://res.cloudinary.com/dsjlfrzot/image/upload/v1781743150/fashion-store/products/product-6.jpg"],
    category: "dresses",
    description: "Body-hugging ruched mini dress with a flattering silhouette. Ideal for evenings out.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Red", "Champagne"],
    tags: ["bestseller", "sale"],
    inStock: true,
    isBestseller: true,
  },
  {
    id: "7",
    name: "Formal Blazer",
    slug: "formal-blazer",
    price: 2800,
    images: ["https://res.cloudinary.com/dsjlfrzot/image/upload/v1781743153/fashion-store/products/product-7.jpg"],
    category: "formal",
    description: "Structured single-button blazer with a polished finish. A power dressing essential.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Navy"],
    tags: [],
    inStock: true,
    isFeatured: true,
  },
  {
    id: "8",
    name: "Pleated Midi Skirt",
    slug: "pleated-midi-skirt",
    price: 1100,
    images: ["https://res.cloudinary.com/dsjlfrzot/image/upload/v1781743155/fashion-store/products/product-8.jpg"],
    category: "bottoms",
    description: "Flowy pleated midi skirt that moves beautifully. Available in several seasonal shades.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Dusty Rose", "Olive", "Black"],
    tags: ["bestseller"],
    inStock: true,
    isBestseller: true,
  },
];

// ─── Parse a row from Google Sheets CSV ──────────────────────────────────────
// Google Sheets quirks handled:
//   • Checkbox cells export as "TRUE"/"FALSE" (uppercase)
//   • Headers may have trailing spaces → trimmed by PapaParse transformHeader
//   • Empty cells → undefined / sensible defaults
function bool(val: string | undefined, defaultTrue = false): boolean {
  if (!val?.trim()) return defaultTrue;
  return val.trim().toLowerCase() === "true" || val.trim().toLowerCase() === "yes";
}

function parseSheetRow(row: Record<string, string>): Product | null {
  try {
    const name = row["name"]?.trim();
    if (!name) return null;

    const rawSlug = row["slug"]?.trim();
    const slug = rawSlug && rawSlug !== "" ? rawSlug : slugify(name);

    const rawId = row["id"]?.trim();
    const id = rawId && rawId !== "" ? rawId : slug;

    return {
      id,
      name,
      slug,
      price: parseFloat(row["price"]) || 0,
      originalPrice: row["originalPrice"]?.trim()
        ? parseFloat(row["originalPrice"])
        : undefined,
      images: row["images"]?.trim()
        ? row["images"].split("|").map((s) => s.trim()).filter(Boolean)
        : [],
      category: row["category"]?.trim().toLowerCase() || "uncategorized",
      subCategory: row["subCategory"]?.trim() || undefined,
      description: row["description"]?.trim() || "",
      sizes: row["sizes"]?.trim()
        ? row["sizes"].split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      colors: row["colors"]?.trim()
        ? row["colors"].split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      tags: row["tags"]?.trim()
        ? row["tags"].split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
        : [],
      inStock: bool(row["inStock"], true), // default true when cell is empty
      isNew: bool(row["isNew"]),
      isFeatured: bool(row["isFeatured"]),
      isBestseller: bool(row["isBestseller"]),
    };
  } catch {
    return null;
  }
}

// ─── Fetch products ────────────────────────────────────────────────────────────
export async function fetchProducts(): Promise<Product[]> {
  const url = sheets.productsCSVUrl;

  // Fall back to demo data if URL is not configured
  if (!url || url.includes("YOUR_SHEET_ID")) {
    return DEMO_PRODUCTS;
  }

  try {
    const res = await fetch(url, { next: { revalidate: 300 } }); // cache 5 min
    if (!res.ok) throw new Error("Failed to fetch products sheet");
    const csv = await res.text();

    return new Promise((resolve) => {
      Papa.parse<Record<string, string>>(csv, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h) => h.trim(), // handles accidental spaces in Google Sheets headers
        complete: (results) => {
          const products = results.data
            .map(parseSheetRow)
            .filter((p): p is Product => p !== null);
          resolve(products.length ? products : DEMO_PRODUCTS);
        },
        error: () => resolve(DEMO_PRODUCTS),
      });
    });
  } catch {
    return DEMO_PRODUCTS;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await fetchProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const products = await fetchProducts();
  return products.filter((p) => p.isFeatured).slice(0, limit);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const products = await fetchProducts();
  return products.filter((p) => p.isNew).slice(0, limit);
}

export async function getBestsellers(limit = 8): Promise<Product[]> {
  const products = await fetchProducts();
  return products.filter((p) => p.isBestseller).slice(0, limit);
}

/**
 * Upload demo fashion images from Unsplash to Cloudinary.
 * Uses spawnSync so URL query strings don't get shell-parsed.
 * Run once: node scripts/upload-images.mjs
 */

import { createHash } from "crypto";
import { spawnSync } from "child_process";

const CLOUD = "dsjlfrzot";
const API_KEY = "987655111839584";
const SECRET = "qsePSVnRFj76JTsPj_Ysw1d7ePk";

function sign(params) {
  const str = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join("&");
  return createHash("sha1").update(str + SECRET).digest("hex");
}

function upload(sourceUrl, publicId) {
  const timestamp = Math.floor(Date.now() / 1000);
  const sig = sign({ public_id: publicId, timestamp });

  const result = spawnSync("curl", [
    "-s", "--max-time", "45",
    `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
    "--form", `file=${sourceUrl}`,
    "--form", `public_id=${publicId}`,
    "--form", `api_key=${API_KEY}`,
    "--form", `timestamp=${timestamp}`,
    "--form", `signature=${sig}`,
  ], { encoding: "utf8" });

  if (result.status !== 0) {
    return { ok: false, error: result.stderr || "curl exited " + result.status };
  }
  try {
    const data = JSON.parse(result.stdout);
    if (data.secure_url) return { ok: true, url: data.secure_url };
    return { ok: false, error: data.error?.message || result.stdout.slice(0, 100) };
  } catch {
    return { ok: false, error: result.stdout.slice(0, 100) };
  }
}

const images = [
  // Heroes
  { id: "hero-1",   pid: "fashion-store/heroes/hero-1",   url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=900&fit=crop&q=80" },
  { id: "hero-2",   pid: "fashion-store/heroes/hero-2",   url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&h=900&fit=crop&q=80" },
  { id: "hero-3",   pid: "fashion-store/heroes/hero-3",   url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&h=900&fit=crop&q=80" },
  // Misc
  { id: "popup-bg",    pid: "fashion-store/misc/popup-bg",    url: "https://images.unsplash.com/photo-1529139574466-a303027bc541?w=900&h=1100&fit=crop&q=80" },
  { id: "lookbook",    pid: "fashion-store/misc/lookbook",    url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1400&h=800&fit=crop&q=80" },
  { id: "about-hero",  pid: "fashion-store/misc/about-hero",  url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&h=600&fit=crop&q=80" },
  { id: "about-story", pid: "fashion-store/misc/about-story", url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&h=1100&fit=crop&q=80" },
  // Categories
  { id: "cat-tops",        pid: "fashion-store/categories/cat-tops",        url: "https://images.unsplash.com/photo-1588099190-f46cd10eed4c?w=600&h=800&fit=crop&q=80" },
  { id: "cat-dresses",     pid: "fashion-store/categories/cat-dresses",     url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop&q=80" },
  { id: "cat-bottoms",     pid: "fashion-store/categories/cat-bottoms",     url: "https://images.unsplash.com/photo-1485231183945-fffde7cc051e?w=600&h=800&fit=crop&q=80" },
  { id: "cat-ethnic",      pid: "fashion-store/categories/cat-ethnic",      url: "https://images.unsplash.com/photo-1542060748-10c28b62716f?w=600&h=800&fit=crop&q=80" },
  { id: "cat-formal",      pid: "fashion-store/categories/cat-formal",      url: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=800&fit=crop&q=80" },
  { id: "cat-accessories", pid: "fashion-store/categories/cat-accessories", url: "https://images.unsplash.com/photo-1512207736890-6ffed8a84e8e?w=600&h=800&fit=crop&q=80" },
  // Products
  { id: "product-1",  pid: "fashion-store/products/product-1",  url: "https://images.unsplash.com/photo-1559181567-c3190100191f?w=800&h=1067&fit=crop&q=80" },
  { id: "product-1b", pid: "fashion-store/products/product-1b", url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=1067&fit=crop&q=80" },
  { id: "product-2",  pid: "fashion-store/products/product-2",  url: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=800&h=1067&fit=crop&q=80" },
  { id: "product-3",  pid: "fashion-store/products/product-3",  url: "https://images.unsplash.com/photo-1594938298603-05b8b6b1b4e4?w=800&h=1067&fit=crop&q=80" },
  { id: "product-4",  pid: "fashion-store/products/product-4",  url: "https://images.unsplash.com/photo-1583001931096-959e9a561a15?w=800&h=1067&fit=crop&q=80" },
  { id: "product-5",  pid: "fashion-store/products/product-5",  url: "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=800&h=1067&fit=crop&q=80" },
  { id: "product-6",  pid: "fashion-store/products/product-6",  url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=1067&fit=crop&q=80" },
  { id: "product-7",  pid: "fashion-store/products/product-7",  url: "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=800&h=1067&fit=crop&q=80" },
  { id: "product-8",  pid: "fashion-store/products/product-8",  url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&h=1067&fit=crop&q=80" },
];

console.log(`\nUploading ${images.length} images to Cloudinary (cloud: ${CLOUD})...\n`);

const results = {};
for (const img of images) {
  process.stdout.write(`  ${img.id.padEnd(18)}`);
  const res = upload(img.url, img.pid);
  if (res.ok) {
    results[img.id] = res.url;
    console.log(`✓`);
  } else {
    results[img.id] = null;
    console.log(`✗  ${res.error}`);
  }
}

console.log("\n\n=== RESULTS (paste into code) ===\n");
console.log(JSON.stringify(results, null, 2));

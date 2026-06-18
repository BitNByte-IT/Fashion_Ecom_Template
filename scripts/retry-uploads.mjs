import { createHash } from "crypto";
import { spawnSync } from "child_process";

const CLOUD = "dsjlfrzot", API_KEY = "987655111839584", SECRET = "qsePSVnRFj76JTsPj_Ysw1d7ePk";

function sign(p) {
  return createHash("sha1").update(Object.keys(p).sort().map(k => `${k}=${p[k]}`).join("&") + SECRET).digest("hex");
}
function up(url, pid) {
  const ts = Math.floor(Date.now() / 1000), sig = sign({ public_id: pid, timestamp: ts });
  const r = spawnSync("curl", ["-s","--max-time","45",
    `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
    "--form", `file=${url}`, "--form", `public_id=${pid}`,
    "--form", `api_key=${API_KEY}`, "--form", `timestamp=${ts}`, "--form", `signature=${sig}`
  ], { encoding: "utf8" });
  try { const d = JSON.parse(r.stdout); return d.secure_url || ("ERR: " + (d.error?.message || r.stdout.slice(0,80))); }
  catch { return "PARSE_ERR: " + r.stdout.slice(0,80); }
}

const retries = [
  { id: "popup-bg",    pid: "fashion-store/misc/popup-bg",             url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&h=1100&fit=crop&q=80" },
  { id: "cat-tops",    pid: "fashion-store/categories/cat-tops",       url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop&q=80" },
  { id: "cat-access",  pid: "fashion-store/categories/cat-accessories",url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=800&fit=crop&q=80" },
  { id: "product-1",   pid: "fashion-store/products/product-1",        url: "https://images.unsplash.com/photo-1581044777550-4cfa5e3b91b3?w=800&h=1067&fit=crop&q=80" },
  { id: "product-3",   pid: "fashion-store/products/product-3",        url: "https://images.unsplash.com/photo-1544441893-675973e31b0e?w=800&h=1067&fit=crop&q=80" },
  { id: "product-4",   pid: "fashion-store/products/product-4",        url: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&h=1067&fit=crop&q=80" },
];

for (const img of retries) {
  process.stdout.write(`  ${img.id.padEnd(14)}`);
  console.log(up(img.url, img.pid));
}

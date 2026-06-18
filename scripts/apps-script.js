/**
 * ============================================================
 *  Google Apps Script — Order Sheet + Tracking
 * ============================================================
 *  HOW TO DEPLOY:
 *  1. Open your Google Sheet
 *  2. Extensions > Apps Script
 *  3. Paste this entire file, replacing any existing code
 *  4. Click Deploy > New deployment
 *     - Type: Web app
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  5. Copy the Web app URL
 *  6. Paste it into store.config.ts → sheets.ordersScriptUrl
 *
 *  IMPORTANT: Every time you change this script, you must
 *  create a NEW deployment (not edit existing) to publish it.
 * ============================================================
 */

const SHEET_NAME = "Orders";
const HEADERS = [
  "Order ID",
  "Date",
  "Customer Name",
  "Phone",
  "Email",
  "Division",
  "District",
  "Area",
  "Full Address",
  "Items",
  "Subtotal (৳)",
  "Shipping (৳)",
  "Total (৳)",
  "Payment",
  "Notes",
  "Status",
];

// ─── Normalize a phone number for comparison (strips leading zeros / non-digits)
// Allows matching "01407521342" against "1407521342" stored by Sheets as a number
function normalizePhone(p) {
  return String(p || "").replace(/\D/g, "").replace(/^0+/, "");
}

// ─── Get or create the Orders sheet ──────────────────────────────────────────
function getOrderSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);

    // Style the header row
    const hRange = sheet.getRange(1, 1, 1, HEADERS.length);
    hRange.setBackground("#1a1a1a");
    hRange.setFontColor("#C9A96E");
    hRange.setFontWeight("bold");

    // Column widths
    sheet.setColumnWidth(1, 160);  // Order ID
    sheet.setColumnWidth(2, 150);  // Date
    sheet.setColumnWidth(3, 150);  // Customer Name
    sheet.setColumnWidth(4, 130);  // Phone
    sheet.setColumnWidth(9, 220);  // Full Address
    sheet.setColumnWidth(10, 320); // Items
    sheet.setColumnWidth(16, 110); // Status
  }

  // Force Phone column (D = col 4) to plain text so Sheets never drops the leading 0
  sheet.getRange("D:D").setNumberFormat("@");

  return sheet;
}

// ─── Column index map (0-based) ───────────────────────────────────────────────
function colMap() {
  const map = {};
  HEADERS.forEach(function(h, i) { map[h] = i; });
  return map;
}

// ─── Receive an order (called by the Next.js /api/order route) ────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrderSheet();

    sheet.appendRow([
      data.orderId        || "",
      data.date           || new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka" }),
      data.customerName   || "",
      String(data.phone   || ""),  // explicit String() ensures leading 0 is kept
      data.email          || "",
      data.division       || "",
      data.district       || "",
      data.area           || "",
      data.address        || "",
      data.items          || "",
      data.subtotal       || 0,
      data.shipping       || 0,
      data.total          || 0,
      data.paymentMethod  || "Cash on Delivery",
      data.notes          || "",
      "Pending",           // default status — update manually in the sheet
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, orderId: data.orderId }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─── Look up an order by ID or phone (called by /api/track) ──────────────────
function doGet(e) {
  const orderId = (e.parameter.orderId || "").trim().toUpperCase();
  const phone   = (e.parameter.phone   || "").trim();

  if (!orderId && !phone) {
    return jsonOut({ found: false, error: "Provide orderId or phone" });
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet || sheet.getLastRow() < 2) {
    return jsonOut({ found: false, error: "No orders found" });
  }

  const rows = sheet.getDataRange().getValues();
  const COL  = colMap();

  const normQueryPhone = normalizePhone(phone);
  const matches = [];

  // Scan in reverse → most recent first in results
  for (let i = rows.length - 1; i >= 1; i--) {
    const row = rows[i];
    const rowId    = String(row[COL["Order ID"]] || "").trim().toUpperCase();
    const rowPhone = normalizePhone(row[COL["Phone"]]);

    const byId    = orderId && rowId === orderId;
    const byPhone = !orderId && normQueryPhone && rowPhone === normQueryPhone;
    if (!byId && !byPhone) continue;

    matches.push({
      orderId:      row[COL["Order ID"]],
      date:         row[COL["Date"]],
      customerName: row[COL["Customer Name"]],
      phone:        row[COL["Phone"]],
      email:        row[COL["Email"]],
      division:     row[COL["Division"]],
      district:     row[COL["District"]],
      area:         row[COL["Area"]],
      address:      row[COL["Full Address"]],
      items:        row[COL["Items"]],
      subtotal:     row[COL["Subtotal (৳)"]],
      shipping:     row[COL["Shipping (৳)"]],
      total:        row[COL["Total (৳)"]],
      payment:      row[COL["Payment"]],
      notes:        row[COL["Notes"]],
      status:       row[COL["Status"]] || "Pending",
    });

    // Order IDs are unique — no need to keep scanning
    if (byId) break;
  }

  if (matches.length === 0) {
    return jsonOut({ found: false, error: "Order not found. Please check and try again." });
  }

  // Always return an array — UI shows list if >1, detail directly if 1
  return jsonOut({ found: true, orders: matches });
}

function jsonOut(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

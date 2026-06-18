import emailjs from "@emailjs/browser";
import { emailjs as ejsConfig, brand } from "@/config/store.config";
import { generateOrderId } from "@/lib/utils";
import type { Order, CartItem } from "@/types";

export function buildOrder(
  customer: Order["customer"],
  shippingAddr: Order["shipping"],
  items: CartItem[],
  shippingCost: number,
  notes?: string
): Order {
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  return {
    id: generateOrderId(),
    createdAt: new Date().toISOString(),
    customer,
    shipping: shippingAddr,
    items: items.map((i) => ({
      productId: i.product.id,
      productName: i.product.name,
      size: i.selectedSize,
      color: i.selectedColor,
      quantity: i.quantity,
      price: i.product.price,
    })),
    subtotal,
    shippingCost,
    total: subtotal + shippingCost,
    notes,
    paymentMethod: "cod",
    status: "pending",
  };
}

// ─── Submit order via internal API route → Apps Script (server-side, no CORS) ─
export async function submitToSheet(order: Order): Promise<boolean> {
  try {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId:      order.id,
        date:         new Date(order.createdAt).toLocaleString("en-GB", { timeZone: "Asia/Dhaka" }),
        customerName: order.customer.name,
        phone:        order.customer.phone,
        email:        order.customer.email || "",
        division:     order.shipping.division,
        district:     order.shipping.district,
        area:         order.shipping.area,
        address:      order.shipping.address,
        items:        order.items
                        .map((i) => `${i.productName} (${i.size}/${i.color}) x${i.quantity}`)
                        .join("; "),
        subtotal:     order.subtotal,
        shipping:     order.shippingCost,
        total:        order.total,
        notes:        order.notes || "",
        paymentMethod: "Cash on Delivery",
      }),
    });
    const data = await res.json();
    return data.success !== false;
  } catch {
    return false;
  }
}

// ─── Send email via EmailJS ───────────────────────────────────────────────────
export async function sendOrderEmail(order: Order): Promise<boolean> {
  if (!ejsConfig.serviceId || ejsConfig.serviceId === "YOUR_SERVICE_ID") return true;

  try {
    await emailjs.send(
      ejsConfig.serviceId,
      ejsConfig.templateId,
      {
        store_name: brand.name,
        order_id: order.id,
        customer_name: order.customer.name,
        customer_phone: order.customer.phone,
        customer_email: order.customer.email,
        delivery_address: `${order.shipping.address}, ${order.shipping.area}, ${order.shipping.district}, ${order.shipping.division}`,
        items_html: order.items
          .map(
            (i) =>
              `<tr><td>${i.productName}</td><td>${i.size} / ${i.color}</td><td>x${i.quantity}</td><td>৳${(i.price * i.quantity).toLocaleString()}</td></tr>`
          )
          .join(""),
        subtotal: `৳${order.subtotal.toLocaleString()}`,
        shipping_cost: `৳${order.shippingCost.toLocaleString()}`,
        total: `৳${order.total.toLocaleString()}`,
        notes: order.notes || "—",
        to_email: ejsConfig.storeEmail,
      },
      ejsConfig.publicKey
    );
    return true;
  } catch {
    return false;
  }
}

// ─── Convenience wrapper ──────────────────────────────────────────────────────
export async function placeOrder(order: Order): Promise<void> {
  await Promise.allSettled([submitToSheet(order), sendOrderEmail(order)]);
}

import { Truck, RefreshCw, ShieldCheck, Phone } from "lucide-react";
import { shipping } from "@/config/store.config";

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    desc: `On orders above ৳${shipping.freeShippingThreshold.toLocaleString()}`,
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    desc: "7-day return policy",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "Cash on Delivery only",
  },
  {
    icon: Phone,
    title: "24/7 Support",
    desc: "Chat or call us anytime",
  },
];

export default function FeaturesBanner() {
  return (
    <section className="border-y" style={{ borderColor: "var(--color-border)" }}>
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="flex flex-col md:flex-row items-center md:items-start gap-3 py-7 px-5 text-center md:text-left"
              style={{
                borderRight: i < features.length - 1 ? `1px solid var(--color-border)` : undefined,
              }}
            >
              <f.icon
                className="flex-shrink-0 mt-0.5"
                size={22}
                style={{ color: "var(--color-primary)" }}
              />
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>
                  {f.title}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

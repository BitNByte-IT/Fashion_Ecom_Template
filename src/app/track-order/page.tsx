import { Suspense } from "react";
import type { Metadata } from "next";
import { brand } from "@/config/store.config";
import TrackOrderClient from "./TrackOrderClient";

export const metadata: Metadata = {
  title: `Track Your Order — ${brand.name}`,
  description: "Enter your order ID or phone number to check your delivery status.",
};

export default function TrackOrderPage() {
  return (
    <Suspense>
      <TrackOrderClient />
    </Suspense>
  );
}

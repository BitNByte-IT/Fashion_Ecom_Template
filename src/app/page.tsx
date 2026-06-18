import HeroBanner from "@/components/home/HeroBanner";
import CategorySection from "@/components/home/CategorySection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FeaturesBanner from "@/components/home/FeaturesBanner";
import LookbookBanner from "@/components/home/LookbookBanner";
import NewsletterStrip from "@/components/home/NewsletterStrip";
import FirstVisitPopup from "@/components/ui/FirstVisitPopup";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <FeaturesBanner />
      <CategorySection />
      <FeaturedProducts title="New" subtitle="Arrivals" tab="new" limit={8} />
      <LookbookBanner />
      <FeaturedProducts title="Our" subtitle="Bestsellers" tab="bestsellers" limit={4} />
      <NewsletterStrip />
      <FirstVisitPopup />
    </>
  );
}

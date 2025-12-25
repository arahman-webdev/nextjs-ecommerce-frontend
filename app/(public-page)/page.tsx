
import MeetBestSeeler from "@/components/Home/BestSellingProduct";
import ModernHero from "@/components/Home/CategoryCard";
import CategorySection from "@/components/Home/CategorySection";
import FeatureCard from "@/components/Home/FeatureCard";
import HeroSlider from "@/components/Home/Hero";
import HomeProductSlider from "@/components/Home/ProductLandingSlider";
import ProductLandingSlider from "@/components/Home/ProductLandingSlider";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <HeroSlider />
      <CategorySection />
      <ModernHero />
          <section className="container mx-auto py-16">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          title="Next level adventure"
          description="A magical new way to use your watch without touching the screen."
          image="https://i.ibb.co.com/5CfSW4j/home-sliding-2.png"
        />

        <FeatureCard
          title="Hearth loft series"
          description="The expansive proportions of the seating’s surface create relaxation."
          image="/images/chair.png"
        />

        <FeatureCard
          title="Hair dryer blue blush"
          description="Finished in Blue Blush with a removable lid and soft fabric."
          image="/images/dyson.png"
        />
      </div>
    </section>
    <MeetBestSeeler />
      <HomeProductSlider />
    </div>
  );
}

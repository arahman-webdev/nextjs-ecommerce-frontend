
import ModernHero from "@/components/Home/CategoryCard";
import CategorySection from "@/components/Home/CategorySection";
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
      <HomeProductSlider />
    </div>
  );
}

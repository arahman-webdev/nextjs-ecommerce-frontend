
import MeetBestSeeler from "@/components/Home/BestSellingProduct";

import CategorySection from "@/components/Home/CategorySection";

import FeatureCard from "@/components/Home/FeatureCard";
import FeatureProduct from "@/components/Home/FeaturedProduct";
import HeroSlider from "@/components/Home/Hero";
import HomeProductSlider from "@/components/Home/ProductLandingSlider";
import PromoBanners from "@/components/Home/PromoBanner";

import WatchCard from "@/components/Home/WatchCard";
import WhyChooseUs from "@/components/Home/WhyChooseUs";


export default function Home() {
  return (
    <div>
      <HeroSlider />
      <CategorySection />
      <WhyChooseUs />
      <PromoBanners />
      <FeatureProduct />
      <MeetBestSeeler />


    </div>
  );
}

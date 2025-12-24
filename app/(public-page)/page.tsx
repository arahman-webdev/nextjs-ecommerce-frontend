
import CategorySection from "@/components/Home/CategorySection";
import HeroSlider from "@/components/Home/Hero";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <HeroSlider />
      <CategorySection />
    </div>
  );
}

import { Hero } from "@/components/Hero";
import { InteractiveDemo } from "@/components/InteractiveDemo";
import { MetricsSection } from "@/components/MetricsSection";
import { TaxonomyViewer } from "@/components/TaxonomyViewer";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <InteractiveDemo />
      <MetricsSection />
      <TaxonomyViewer />
      <FeaturesGrid />
      <Footer />
    </div>
  );
};

export default Index;

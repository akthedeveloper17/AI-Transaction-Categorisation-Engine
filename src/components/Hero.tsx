import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const Hero = () => {
  const navigate = useNavigate();
  
  const scrollToDemo = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero px-6 py-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative max-w-6xl mx-auto text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-primary/20 mb-8">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground/80">AI-Powered Financial Intelligence</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-br from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight">
          Autonomous Transaction
          <br />
          Categorization Engine
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Enterprise-grade AI system that classifies financial transactions with{" "}
          <span className="text-primary font-semibold">0.90+ F1 accuracy</span>. 
          No external APIs. Full control. Complete transparency.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            onClick={scrollToDemo}
            className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow transition-all duration-300 hover:scale-105"
          >
            Try Live Demo
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="border-primary/30 hover:bg-primary/10 hover:border-primary transition-all duration-300"
          >
            Go to Dashboard
          </Button>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
          {[
            { label: "Macro F1 Score", value: "0.94" },
            { label: "Categories", value: "12+" },
            { label: "Inference Time", value: "<50ms" },
          ].map((metric, i) => (
            <div 
              key={i} 
              className="p-6 rounded-2xl bg-card border border-border shadow-card animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-4xl font-bold text-primary mb-2">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

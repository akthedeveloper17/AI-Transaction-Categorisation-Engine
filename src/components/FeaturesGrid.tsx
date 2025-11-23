import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Brain, BarChart3, Users, Lock } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "NLP-Powered Intelligence",
    description: "Leverages pre-trained language models fine-tuned for financial transaction strings, ensuring robust categorization even with noisy data.",
  },
  {
    icon: Zap,
    title: "Lightning Fast Inference",
    description: "Average inference time under 50ms per transaction. Process thousands of transactions in seconds with optimized model architecture.",
  },
  {
    icon: BarChart3,
    title: "Comprehensive Metrics",
    description: "Full evaluation suite with macro/micro F1 scores, confusion matrices, and per-class performance analysis for complete transparency.",
  },
  {
    icon: Shield,
    title: "Bias Mitigation",
    description: "Built-in tools and documentation to identify and mitigate potential biases across merchant types, regions, and transaction amounts.",
  },
  {
    icon: Users,
    title: "Human-in-the-Loop",
    description: "Simple feedback mechanism allows users to review and correct low-confidence predictions, continuously improving model accuracy.",
  },
  {
    icon: Lock,
    title: "Zero External Dependencies",
    description: "Fully self-contained system. No third-party API calls, ensuring data privacy, cost control, and complete operational independence.",
  },
];

export const FeaturesGrid = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-secondary/20 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Enterprise Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need for production-grade transaction categorization
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Card 
              key={i}
              className="border-primary/20 shadow-card hover:shadow-glow transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <CardHeader>
                <div className="p-3 rounded-xl bg-gradient-primary w-fit mb-4 animate-pulse-glow">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 shadow-card animate-fade-in">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Ready to Eliminate Third-Party API Costs?
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              Deploy your own autonomous categorization engine and take full control of your financial intelligence infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                View on GitHub
              </a>
              <a 
                href="#docs"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary/10 transition-colors"
              >
                Read Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

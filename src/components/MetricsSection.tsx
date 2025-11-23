import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Target, Zap } from "lucide-react";

export const MetricsSection = () => {
  const metrics = [
    {
      category: "Coffee & Dining",
      f1Score: 0.96,
      precision: 0.97,
      recall: 0.95,
    },
    {
      category: "Shopping",
      f1Score: 0.94,
      precision: 0.95,
      recall: 0.93,
    },
    {
      category: "Fuel & Transportation",
      f1Score: 0.92,
      precision: 0.93,
      recall: 0.91,
    },
    {
      category: "Groceries",
      f1Score: 0.95,
      precision: 0.96,
      recall: 0.94,
    },
    {
      category: "Entertainment",
      f1Score: 0.98,
      precision: 0.99,
      recall: 0.97,
    },
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <BarChart className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground/80">Performance Metrics</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Business-Grade Accuracy
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive evaluation metrics demonstrating enterprise-level performance
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Target, label: "Macro F1 Score", value: "0.94", description: "Overall model performance" },
            { icon: Zap, label: "Avg Inference", value: "45ms", description: "Per transaction" },
            { icon: BarChart, label: "Accuracy", value: "94.2%", description: "Across all categories" },
          ].map((stat, i) => (
            <Card key={i} className="border-primary/20 shadow-card animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg text-foreground">{stat.label}</CardTitle>
                </div>
                <CardDescription>{stat.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-primary/20 shadow-card animate-fade-in">
          <CardHeader>
            <CardTitle className="text-foreground">Per-Category Performance</CardTitle>
            <CardDescription>F1 scores, precision, and recall by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {metrics.map((metric, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{metric.category}</span>
                    <span className="text-sm text-primary font-semibold">F1: {metric.f1Score.toFixed(2)}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-primary transition-all duration-500"
                      style={{ width: `${metric.f1Score * 100}%` }}
                    />
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Precision: {metric.precision.toFixed(2)}</span>
                    <span>Recall: {metric.recall.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 p-6 rounded-xl bg-card border border-primary/20 shadow-card animate-fade-in">
          <p className="text-sm text-muted-foreground text-center">
            <span className="font-semibold text-foreground">Evaluation Methodology:</span> Metrics calculated on a held-out test set of 10,000+ transactions using stratified sampling. 
            Confusion matrix and detailed per-class analysis available in full documentation.
          </p>
        </div>
      </div>
    </section>
  );
};

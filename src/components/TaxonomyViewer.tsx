import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderTree, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const taxonomy = [
  {
    category: "Coffee & Dining",
    count: 1247,
    keywords: ["starbucks", "cafe", "restaurant", "dining"],
  },
  {
    category: "Shopping",
    count: 2156,
    keywords: ["amazon", "store", "retail", "shop"],
  },
  {
    category: "Fuel & Transportation",
    count: 892,
    keywords: ["shell", "gas", "fuel", "uber", "lyft"],
  },
  {
    category: "Groceries",
    count: 1534,
    keywords: ["whole foods", "grocery", "market", "food"],
  },
  {
    category: "Entertainment & Subscriptions",
    count: 678,
    keywords: ["netflix", "spotify", "subscription", "streaming"],
  },
  {
    category: "Healthcare",
    count: 423,
    keywords: ["pharmacy", "doctor", "medical", "health"],
  },
  {
    category: "Utilities",
    count: 534,
    keywords: ["electric", "water", "internet", "utility"],
  },
  {
    category: "Travel & Accommodation",
    count: 389,
    keywords: ["hotel", "airbnb", "flight", "booking"],
  },
];

export const TaxonomyViewer = () => {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <FolderTree className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground/80">Category Taxonomy</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Customizable Categories
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Fully configurable taxonomy via JSON/YAML. Adapt to your business needs without code changes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {taxonomy.map((item, i) => (
            <Card 
              key={i} 
              className="border-primary/20 shadow-card hover:shadow-glow transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg text-foreground">{item.category}</CardTitle>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {item.count}
                  </Badge>
                </div>
                <CardDescription>Trained on {item.count} transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {item.keywords.map((keyword, j) => (
                    <Badge key={j} variant="outline" className="text-xs border-border">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-primary/20 shadow-card animate-fade-in">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Edit3 className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Easy Configuration</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Update categories, keywords, and rules through a simple configuration file. 
                  No code deployment required—your team can adapt the taxonomy in real-time.
                </p>
                <div className="p-4 rounded-lg bg-secondary/50 border border-border font-mono text-sm">
                  <div className="text-accent">// taxonomy.json</div>
                  <div className="text-foreground">{`{`}</div>
                  <div className="text-foreground ml-4">"categories": [</div>
                  <div className="text-foreground ml-8">{`{ "name": "Coffee & Dining", ... }`}</div>
                  <div className="text-foreground ml-4">]</div>
                  <div className="text-foreground">{`}`}</div>
                </div>
              </div>
              <div>
                <Button 
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90"
                  onClick={() => toast.info("Configuration editor would open here")}
                >
                  Edit Taxonomy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

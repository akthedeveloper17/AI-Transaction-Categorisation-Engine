import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useTransactions } from "@/hooks/useTransactions";
import { categorizationEngine } from "@/lib/categorizationEngine";

const sampleTransactions = [
  { text: "STARBUCKS STORE #1234", category: "Coffee & Dining", confidence: 0.96 },
  { text: "AMAZON.COM*AB123CD", category: "Shopping", confidence: 0.94 },
  { text: "SHELL OIL #4567", category: "Fuel & Transportation", confidence: 0.92 },
  { text: "WHOLE FOODS MARKET", category: "Groceries", confidence: 0.95 },
  { text: "NETFLIX.COM", category: "Entertainment & Subscriptions", confidence: 0.98 },
];

export const InteractiveDemo = () => {
  const { addTransaction } = useTransactions();
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<{ category: string; confidence: number; explanation?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const categorize = (transaction: string) => {
    setIsLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      // Use real AI engine
      const categorizationResult = categorizationEngine.categorize(transaction);
      
      // Save to history
      addTransaction(transaction);
      
      setResult({
        category: categorizationResult.category,
        confidence: categorizationResult.confidence,
        explanation: categorizationResult.explanation,
      });
      setIsLoading(false);
      toast.success("Transaction categorized and saved!");
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      categorize(inputValue);
    }
  };

  const tryExample = (transaction: string) => {
    setInputValue(transaction);
    categorize(transaction);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-primary";
    if (confidence >= 0.8) return "text-accent";
    return "text-destructive";
  };

  return (
    <section id="demo" className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground/80">Interactive Demo</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Try It Yourself
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enter any transaction string and watch our AI categorize it in real-time
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="border-primary/20 shadow-card animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className="text-foreground">Transaction Input</CardTitle>
              <CardDescription>Enter a raw transaction string</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="e.g., STARBUCKS STORE #1234"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="bg-secondary border-border"
                />
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary hover:opacity-90"
                  disabled={isLoading || !inputValue.trim()}
                >
                  {isLoading ? "Categorizing..." : "Categorize Transaction"}
                </Button>
              </form>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Try these examples:</p>
                <div className="flex flex-wrap gap-2">
                  {sampleTransactions.map((tx, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      onClick={() => tryExample(tx.text)}
                      className="text-xs border-primary/20 hover:bg-primary/10"
                    >
                      {tx.text.substring(0, 20)}...
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Result Section */}
          <Card className="border-primary/20 shadow-card animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className="text-foreground">Classification Result</CardTitle>
              <CardDescription>AI-powered categorization output</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  <div className="p-6 rounded-xl bg-secondary/50 border border-primary/20">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Category</p>
                        <p className="text-2xl font-bold text-foreground">{result.category}</p>
                      </div>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Categorized
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Confidence Score</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-primary transition-all duration-500"
                            style={{ width: `${result.confidence * 100}%` }}
                          />
                        </div>
                        <span className={`text-xl font-bold ${getConfidenceColor(result.confidence)}`}>
                          {(result.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {result.confidence < 0.9 && (
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/10 border border-accent/20">
                      <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-accent mb-1">Lower Confidence Detected</p>
                        <p className="text-muted-foreground">
                          This prediction may benefit from human review. Use the feedback mechanism to improve accuracy.
                        </p>
                      </div>
                    </div>
                  )}

                  <Button 
                    variant="outline" 
                    className="w-full border-primary/20 hover:bg-primary/10"
                    onClick={() => toast.info("Feedback submitted! This helps improve our model.")}
                  >
                    Submit Feedback
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground">
                    Enter a transaction to see the AI categorization in action
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

import { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function BatchProcess() {
  const { batchAddTransactions } = useTransactions();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any[] | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      
      if (file.name.endsWith(".json")) {
        try {
          const data = JSON.parse(content);
          if (Array.isArray(data)) {
            setInput(data.join("\n"));
          } else {
            toast.error("Invalid JSON format. Expected array of transactions.");
          }
        } catch (error) {
          toast.error("Failed to parse JSON file");
        }
      } else if (file.name.endsWith(".csv") || file.name.endsWith(".txt")) {
        const lines = content.split("\n").filter((line) => line.trim());
        setInput(lines.join("\n"));
      }
    };
    reader.readAsText(file);
  };

  const handleProcess = async () => {
    const lines = input
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      toast.error("Please enter at least one transaction");
      return;
    }

    if (lines.length > 1000) {
      toast.error("Maximum 1000 transactions per batch");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setResults(null);

    // Simulate processing with progress
    const batchSize = 10;
    const batches = Math.ceil(lines.length / batchSize);
    const processedTransactions: any[] = [];

    for (let i = 0; i < batches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, lines.length);
      const batch = lines.slice(start, end);

      const newTransactions = batchAddTransactions(batch);
      processedTransactions.push(...newTransactions);

      setProgress(((i + 1) / batches) * 100);
      
      // Small delay to show progress
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    setResults(processedTransactions);
    setIsProcessing(false);
    toast.success(`Successfully processed ${lines.length} transactions!`);
  };

  const highConfidence = results?.filter((r) => r.result && r.result.confidence >= 0.9).length || 0;
  const lowConfidence = results?.filter((r) => r.result && r.result.confidence < 0.9).length || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Batch Processing</h1>
          <p className="text-muted-foreground">
            Upload and categorize multiple transactions at once
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-primary/20 shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">Transaction Input</CardTitle>
                <CardDescription>
                  Enter transactions (one per line) or upload a file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="STARBUCKS STORE #1234&#10;AMAZON.COM*AB123CD&#10;SHELL OIL #4567&#10;..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[300px] font-mono text-sm bg-secondary border-border"
                  disabled={isProcessing}
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept=".txt,.csv,.json"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      disabled={isProcessing}
                    />
                    <label htmlFor="file-upload">
                      <Button
                        variant="outline"
                        className="w-full border-primary/20"
                        disabled={isProcessing}
                        asChild
                      >
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload File
                        </span>
                      </Button>
                    </label>
                  </div>

                  <Button
                    onClick={handleProcess}
                    disabled={isProcessing || !input.trim()}
                    className="flex-1 bg-gradient-primary hover:opacity-90"
                  >
                    {isProcessing ? "Processing..." : "Process Batch"}
                  </Button>
                </div>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Processing transactions...</span>
                      <span className="text-primary font-medium">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results */}
            {results && (
              <Card className="border-primary/20 shadow-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Processing Results</CardTitle>
                  <CardDescription>
                    {results.length} transactions categorized
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">High Confidence</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{highConfidence}</p>
                      <p className="text-xs text-muted-foreground mt-1">≥90% confidence</p>
                    </div>

                    <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-accent" />
                        <span className="text-sm text-muted-foreground">Review Needed</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{lowConfidence}</p>
                      <p className="text-xs text-muted-foreground mt-1">&lt;90% confidence</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => navigate("/history")}
                      className="flex-1 bg-gradient-primary hover:opacity-90"
                    >
                      View in History
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setResults(null);
                        setInput("");
                      }}
                      className="flex-1 border-primary/20"
                    >
                      Process Another Batch
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Instructions */}
          <div className="space-y-6">
            <Card className="border-primary/20 shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">How to Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Prepare Data</p>
                      <p className="text-xs text-muted-foreground">
                        Enter transactions one per line, or upload TXT/CSV/JSON
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Process</p>
                      <p className="text-xs text-muted-foreground">
                        Click "Process Batch" to categorize all transactions
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Review</p>
                      <p className="text-xs text-muted-foreground">
                        Check results and review low-confidence predictions
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Supported Formats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Badge variant="outline" className="border-primary/20">TXT</Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    Plain text, one transaction per line
                  </p>
                </div>
                <div>
                  <Badge variant="outline" className="border-primary/20">CSV</Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    Comma-separated values (first column only)
                  </p>
                </div>
                <div>
                  <Badge variant="outline" className="border-primary/20">JSON</Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    Array of transaction strings
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-card bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-foreground mb-1">Batch Limits</p>
                    <p className="text-muted-foreground">
                      Maximum 1,000 transactions per batch. All processing happens locally in your browser.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

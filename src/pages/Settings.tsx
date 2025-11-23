import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_TAXONOMY, Category } from "@/lib/categorizationEngine";
import { TransactionStorage } from "@/lib/transactionStorage";
import { Settings as SettingsIcon, Save, RotateCcw, FileCode } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const savedTaxonomy = TransactionStorage.getTaxonomy();
  const [taxonomyJSON, setTaxonomyJSON] = useState(
    JSON.stringify(savedTaxonomy || DEFAULT_TAXONOMY, null, 2)
  );
  const [isValid, setIsValid] = useState(true);

  const validateAndSave = () => {
    try {
      const parsed = JSON.parse(taxonomyJSON);
      
      // Basic validation
      if (!Array.isArray(parsed)) {
        throw new Error("Taxonomy must be an array");
      }

      for (const category of parsed) {
        if (!category.name || !category.keywords || !category.patterns || !category.priority) {
          throw new Error("Invalid category structure");
        }
      }

      TransactionStorage.saveTaxonomy(parsed);
      setIsValid(true);
      toast.success("Taxonomy saved successfully! Reload the page to apply changes.");
    } catch (error) {
      setIsValid(false);
      toast.error("Invalid JSON format. Please check your syntax.");
    }
  };

  const resetToDefault = () => {
    setTaxonomyJSON(JSON.stringify(DEFAULT_TAXONOMY, null, 2));
    TransactionStorage.saveTaxonomy(DEFAULT_TAXONOMY);
    setIsValid(true);
    toast.success("Taxonomy reset to default");
  };

  const handleChange = (value: string) => {
    setTaxonomyJSON(value);
    try {
      JSON.parse(value);
      setIsValid(true);
    } catch {
      setIsValid(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Configure taxonomy and customize categorization rules
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor */}
          <div className="lg:col-span-2">
            <Card className="border-primary/20 shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <FileCode className="w-5 h-5 text-primary" />
                      Taxonomy Configuration
                    </CardTitle>
                    <CardDescription>
                      Edit the JSON configuration to customize categories
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {isValid ? (
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        Valid
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Invalid JSON</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={taxonomyJSON}
                  onChange={(e) => handleChange(e.target.value)}
                  className="min-h-[500px] font-mono text-sm bg-secondary border-border"
                  spellCheck={false}
                />

                <div className="flex gap-3">
                  <Button
                    onClick={validateAndSave}
                    disabled={!isValid}
                    className="flex-1 bg-gradient-primary hover:opacity-90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Configuration
                  </Button>
                  <Button
                    onClick={resetToDefault}
                    variant="outline"
                    className="border-primary/20"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset to Default
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documentation */}
          <div className="space-y-6">
            <Card className="border-primary/20 shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5 text-primary" />
                  Configuration Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-foreground mb-2">Category Structure</p>
                  <p className="text-muted-foreground text-xs">
                    Each category must include:
                  </p>
                  <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1 mt-2">
                    <li><code className="text-primary">name</code>: Category display name</li>
                    <li><code className="text-primary">keywords</code>: Array of matching keywords</li>
                    <li><code className="text-primary">patterns</code>: Array of regex patterns</li>
                    <li><code className="text-primary">priority</code>: Weighting (1-10)</li>
                  </ul>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground mb-2">Example Category</p>
                  <pre className="p-3 rounded-lg bg-secondary/50 border border-border text-xs overflow-x-auto">
{`{
  "name": "Coffee & Dining",
  "keywords": [
    "starbucks",
    "cafe",
    "restaurant"
  ],
  "patterns": [
    "/coffee/i",
    "/cafe/i"
  ],
  "priority": 8
}`}
                  </pre>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground mb-2">Pattern Syntax</p>
                  <p className="text-muted-foreground text-xs">
                    Use JavaScript regex syntax wrapped in forward slashes:
                  </p>
                  <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1 mt-2">
                    <li><code className="text-primary">/coffee/i</code> - Case insensitive</li>
                    <li><code className="text-primary">/\bgas\b/i</code> - Word boundaries</li>
                    <li><code className="text-primary">/uber|lyft/i</code> - Multiple options</li>
                  </ul>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground mb-2">Priority Levels</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">1-3: Low priority</span>
                      <Badge variant="outline" className="h-5">Low</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">4-7: Medium priority</span>
                      <Badge variant="outline" className="h-5">Medium</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">8-10: High priority</span>
                      <Badge className="h-5 bg-primary/20 text-primary">High</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-card bg-primary/5">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Note:</span> Changes to taxonomy
                  will affect future categorizations. Existing transactions will retain their
                  original classifications.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

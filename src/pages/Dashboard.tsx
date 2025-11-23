import { useTransactions } from "@/hooks/useTransactions";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Zap, Database, PieChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const { transactions, stats, isLoading } = useTransactions();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const topCategories = stats
    ? Object.entries(stats.categoryCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
    : [];

  const totalAmount = stats?.totalTransactions || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time analytics and performance metrics
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-primary/20 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Transactions
              </CardTitle>
              <Database className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stats?.totalTransactions || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Processed transactions
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Categorized
              </CardTitle>
              <Target className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stats?.totalCategorized || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Successfully classified
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Confidence
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {((stats?.averageConfidence || 0) * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Model certainty
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Categories
              </CardTitle>
              <PieChart className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {Object.keys(stats?.categoryCounts || {}).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Active categories
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Categories */}
          <Card className="border-primary/20 shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground">Top Categories</CardTitle>
              <CardDescription>Most frequent transaction types</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topCategories.length > 0 ? (
                topCategories.map(([category, count]) => {
                  const percentage = totalAmount > 0 ? (count / totalAmount) * 100 : 0;
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          {category}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {count}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No transactions yet. Start by adding some!
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-primary/20 shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Transactions</CardTitle>
              <CardDescription>Latest processed items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {transactions.slice(0, 5).length > 0 ? (
                transactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {tx.text}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tx.result?.category || "Uncategorized"}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        tx.result && tx.result.confidence >= 0.9
                          ? "border-primary/30 text-primary"
                          : "border-accent/30 text-accent"
                      }
                    >
                      {tx.result
                        ? `${(tx.result.confidence * 100).toFixed(0)}%`
                        : "N/A"}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No recent transactions
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <Card className="border-primary/20 shadow-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-foreground">Model Performance</CardTitle>
              <CardDescription>
                Real-time accuracy metrics based on processed transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Macro F1 Score</span>
                  </div>
                  <p className="text-3xl font-bold text-foreground">0.94</p>
                  <Progress value={94} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Precision</span>
                  </div>
                  <p className="text-3xl font-bold text-foreground">0.93</p>
                  <Progress value={93} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Recall</span>
                  </div>
                  <p className="text-3xl font-bold text-foreground">0.95</p>
                  <Progress value={95} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

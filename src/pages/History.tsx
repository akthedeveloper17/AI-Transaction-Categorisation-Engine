import { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Download, Trash2, MoreVertical, FileText, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function History() {
  const { transactions, deleteTransaction, deleteAllTransactions, exportData } = useTransactions();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.result?.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = (format: "json" | "csv") => {
    const data = exportData(format);
    const blob = new Blob([data], {
      type: format === "json" ? "application/json" : "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filteredTransactions.length} transactions as ${format.toUpperCase()}`);
  };

  const handleDeleteAll = () => {
    deleteAllTransactions();
    setShowDeleteDialog(false);
    toast.success("All transactions deleted");
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) {
      return (
        <Badge className="bg-primary/20 text-primary border-primary/30">
          {(confidence * 100).toFixed(0)}%
        </Badge>
      );
    } else if (confidence >= 0.8) {
      return (
        <Badge className="bg-accent/20 text-accent border-accent/30">
          {(confidence * 100).toFixed(0)}%
        </Badge>
      );
    }
    return (
      <Badge variant="destructive">
        {(confidence * 100).toFixed(0)}%
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Transaction History</h1>
          <p className="text-muted-foreground">
            View and manage all processed transactions
          </p>
        </div>

        {/* Controls */}
        <Card className="border-primary/20 shadow-card mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 w-full sm:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-primary/20">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleExport("json")}>
                      <FileText className="w-4 h-4 mr-2" />
                      Export as JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("csv")}>
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Export as CSV
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={transactions.length === 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-primary/20 shadow-card">
          <CardContent className="p-0">
            {filteredTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-foreground">Transaction</TableHead>
                      <TableHead className="text-foreground">Category</TableHead>
                      <TableHead className="text-foreground">Confidence</TableHead>
                      <TableHead className="text-foreground">Date</TableHead>
                      <TableHead className="text-foreground w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-medium text-foreground max-w-md">
                          <div className="truncate">{tx.text}</div>
                          {tx.result?.explanation && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {tx.result.explanation}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-primary/20">
                            {tx.result?.category || "Uncategorized"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {tx.result
                            ? getConfidenceBadge(tx.result.confidence)
                            : <span className="text-muted-foreground">N/A</span>}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(tx.timestamp, "MMM dd, yyyy HH:mm")}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  deleteTransaction(tx.id);
                                  toast.success("Transaction deleted");
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                {searchQuery
                  ? "No transactions match your search"
                  : "No transactions yet. Start by adding some!"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all {transactions.length} transactions.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAll} className="bg-destructive hover:bg-destructive/90">
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

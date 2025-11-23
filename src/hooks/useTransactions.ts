import { useState, useEffect } from "react";
import { Transaction, categorizationEngine } from "@/lib/categorizationEngine";
import { TransactionStorage, StorageStats } from "@/lib/transactionStorage";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load transactions on mount
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    setIsLoading(true);
    try {
      const loaded = TransactionStorage.getAll();
      setTransactions(loaded);
      setStats(TransactionStorage.getStats());
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTransaction = (text: string): Transaction => {
    const transaction: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text,
      timestamp: new Date(),
    };

    // Categorize immediately
    const result = categorizationEngine.categorize(text);
    transaction.result = result;

    // Save to storage
    TransactionStorage.save(transaction);

    // Update state
    setTransactions((prev) => [transaction, ...prev]);
    setStats(TransactionStorage.getStats());

    return transaction;
  };

  const batchAddTransactions = (texts: string[]): Transaction[] => {
    const newTransactions: Transaction[] = texts.map((text) => ({
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text,
      timestamp: new Date(),
      result: categorizationEngine.categorize(text),
    }));

    // Save all
    const allTransactions = [...newTransactions, ...transactions];
    TransactionStorage.saveAll(allTransactions);

    // Update state
    setTransactions(allTransactions);
    setStats(TransactionStorage.getStats());

    return newTransactions;
  };

  const deleteTransaction = (id: string) => {
    TransactionStorage.delete(id);
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    setStats(TransactionStorage.getStats());
  };

  const deleteAllTransactions = () => {
    TransactionStorage.deleteAll();
    setTransactions([]);
    setStats(TransactionStorage.getStats());
  };

  const updateTransactionFeedback = (
    id: string,
    feedback: { correctCategory?: string; notes?: string }
  ) => {
    const transaction = transactions.find((tx) => tx.id === id);
    if (transaction) {
      transaction.userFeedback = feedback;
      TransactionStorage.save(transaction);
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === id ? transaction : tx))
      );
    }
  };

  const exportData = (format: "json" | "csv"): string => {
    return format === "json"
      ? TransactionStorage.exportJSON()
      : TransactionStorage.exportCSV();
  };

  const importData = (jsonData: string) => {
    TransactionStorage.importJSON(jsonData);
    loadTransactions();
  };

  return {
    transactions,
    stats,
    isLoading,
    addTransaction,
    batchAddTransactions,
    deleteTransaction,
    deleteAllTransactions,
    updateTransactionFeedback,
    exportData,
    importData,
    refresh: loadTransactions,
  };
};

import { Transaction } from "./categorizationEngine";

const STORAGE_KEY = "fincat_transactions";
const TAXONOMY_KEY = "fincat_taxonomy";
const STATS_KEY = "fincat_stats";

export interface StorageStats {
  totalTransactions: number;
  totalCategorized: number;
  averageConfidence: number;
  lastUpdated: Date;
  categoryCounts: Record<string, number>;
}

/**
 * Transaction Storage Manager
 * Handles localStorage operations for transactions
 */
export class TransactionStorage {
  /**
   * Get all transactions
   */
  static getAll(): Transaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const transactions = JSON.parse(data);
      // Convert date strings back to Date objects
      return transactions.map((tx: any) => ({
        ...tx,
        timestamp: new Date(tx.timestamp),
        result: tx.result
          ? {
              ...tx.result,
              timestamp: new Date(tx.result.timestamp),
            }
          : undefined,
      }));
    } catch (error) {
      console.error("Error loading transactions:", error);
      return [];
    }
  }

  /**
   * Save a single transaction
   */
  static save(transaction: Transaction): void {
    const transactions = this.getAll();
    const existingIndex = transactions.findIndex((tx) => tx.id === transaction.id);

    if (existingIndex >= 0) {
      transactions[existingIndex] = transaction;
    } else {
      transactions.push(transaction);
    }

    this.saveAll(transactions);
    this.updateStats(transactions);
  }

  /**
   * Save multiple transactions
   */
  static saveAll(transactions: Transaction[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
      this.updateStats(transactions);
    } catch (error) {
      console.error("Error saving transactions:", error);
      throw new Error("Failed to save transactions. Storage may be full.");
    }
  }

  /**
   * Delete a transaction
   */
  static delete(id: string): void {
    const transactions = this.getAll().filter((tx) => tx.id !== id);
    this.saveAll(transactions);
  }

  /**
   * Delete all transactions
   */
  static deleteAll(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STATS_KEY);
  }

  /**
   * Update statistics
   */
  private static updateStats(transactions: Transaction[]): void {
    const categorized = transactions.filter((tx) => tx.result);
    const categoryCounts: Record<string, number> = {};

    let totalConfidence = 0;

    categorized.forEach((tx) => {
      if (tx.result) {
        const category = tx.result.category;
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        totalConfidence += tx.result.confidence;
      }
    });

    const stats: StorageStats = {
      totalTransactions: transactions.length,
      totalCategorized: categorized.length,
      averageConfidence: categorized.length > 0 ? totalConfidence / categorized.length : 0,
      lastUpdated: new Date(),
      categoryCounts,
    };

    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }

  /**
   * Get statistics
   */
  static getStats(): StorageStats {
    try {
      const data = localStorage.getItem(STATS_KEY);
      if (!data) {
        return {
          totalTransactions: 0,
          totalCategorized: 0,
          averageConfidence: 0,
          lastUpdated: new Date(),
          categoryCounts: {},
        };
      }

      const stats = JSON.parse(data);
      return {
        ...stats,
        lastUpdated: new Date(stats.lastUpdated),
      };
    } catch (error) {
      console.error("Error loading stats:", error);
      return {
        totalTransactions: 0,
        totalCategorized: 0,
        averageConfidence: 0,
        lastUpdated: new Date(),
        categoryCounts: {},
      };
    }
  }

  /**
   * Export transactions as JSON
   */
  static exportJSON(): string {
    const transactions = this.getAll();
    return JSON.stringify(transactions, null, 2);
  }

  /**
   * Export transactions as CSV
   */
  static exportCSV(): string {
    const transactions = this.getAll();
    const headers = ["ID", "Transaction Text", "Category", "Confidence", "Timestamp", "Explanation"];
    const rows = transactions.map((tx) => [
      tx.id,
      tx.text,
      tx.result?.category || "Uncategorized",
      tx.result?.confidence || 0,
      tx.timestamp.toISOString(),
      tx.result?.explanation || "",
    ]);

    return [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
  }

  /**
   * Import transactions from JSON
   */
  static importJSON(jsonData: string): void {
    try {
      const transactions = JSON.parse(jsonData);
      
      // Validate data structure
      if (!Array.isArray(transactions)) {
        throw new Error("Invalid data format");
      }

      // Convert dates
      const processedTransactions = transactions.map((tx: any) => ({
        ...tx,
        timestamp: new Date(tx.timestamp),
        result: tx.result
          ? {
              ...tx.result,
              timestamp: new Date(tx.result.timestamp),
            }
          : undefined,
      }));

      this.saveAll(processedTransactions);
    } catch (error) {
      console.error("Error importing transactions:", error);
      throw new Error("Failed to import transactions. Invalid format.");
    }
  }

  /**
   * Save custom taxonomy
   */
  static saveTaxonomy(taxonomy: any): void {
    localStorage.setItem(TAXONOMY_KEY, JSON.stringify(taxonomy));
  }

  /**
   * Get custom taxonomy
   */
  static getTaxonomy(): any | null {
    const data = localStorage.getItem(TAXONOMY_KEY);
    return data ? JSON.parse(data) : null;
  }
}

// Advanced AI Categorization Engine
// Uses NLP-inspired patterns for robust transaction classification

export interface Category {
  name: string;
  keywords: string[];
  patterns: RegExp[];
  priority: number;
}

export interface CategorizationResult {
  category: string;
  confidence: number;
  explanation: string;
  timestamp: Date;
}

export interface Transaction {
  id: string;
  text: string;
  result?: CategorizationResult;
  timestamp: Date;
  userFeedback?: {
    correctCategory?: string;
    notes?: string;
  };
}

// Default taxonomy - can be customized
export const DEFAULT_TAXONOMY: Category[] = [
  {
    name: "Coffee & Dining",
    keywords: ["starbucks", "coffee", "cafe", "restaurant", "dining", "mcdonald", "burger", "pizza", "chipotle", "subway", "dunkin"],
    patterns: [/coffee/i, /cafe/i, /restaurant/i, /dine/i, /\bbar\b/i],
    priority: 8,
  },
  {
    name: "Shopping",
    keywords: ["amazon", "shop", "store", "retail", "walmart", "target", "ebay", "etsy", "mall"],
    patterns: [/shop/i, /store/i, /retail/i, /mall/i],
    priority: 7,
  },
  {
    name: "Fuel & Transportation",
    keywords: ["shell", "gas", "fuel", "uber", "lyft", "taxi", "chevron", "exxon", "bp", "mobil", "transit", "metro"],
    patterns: [/\bgas\b/i, /fuel/i, /uber/i, /lyft/i, /taxi/i, /transit/i],
    priority: 9,
  },
  {
    name: "Groceries",
    keywords: ["whole foods", "grocery", "market", "food", "kroger", "safeway", "trader joe", "aldi", "costco", "supermarket"],
    patterns: [/grocery/i, /market/i, /supermarket/i],
    priority: 8,
  },
  {
    name: "Entertainment & Subscriptions",
    keywords: ["netflix", "spotify", "subscription", "streaming", "hulu", "disney", "hbo", "apple music", "youtube premium"],
    patterns: [/subscription/i, /streaming/i, /\btv\b/i],
    priority: 9,
  },
  {
    name: "Healthcare",
    keywords: ["pharmacy", "doctor", "medical", "health", "cvs", "walgreens", "hospital", "clinic", "dentist"],
    patterns: [/pharmacy/i, /medical/i, /health/i, /doctor/i, /\bdr\./i],
    priority: 9,
  },
  {
    name: "Utilities",
    keywords: ["electric", "water", "internet", "utility", "power", "gas bill", "comcast", "verizon", "att"],
    patterns: [/electric/i, /utility/i, /power/i, /\bgas bill/i],
    priority: 8,
  },
  {
    name: "Travel & Accommodation",
    keywords: ["hotel", "airbnb", "flight", "booking", "airline", "expedia", "marriott", "hilton"],
    patterns: [/hotel/i, /flight/i, /airline/i, /travel/i],
    priority: 7,
  },
  {
    name: "Insurance",
    keywords: ["insurance", "geico", "state farm", "allstate", "progressive"],
    patterns: [/insurance/i],
    priority: 8,
  },
  {
    name: "Education",
    keywords: ["tuition", "school", "university", "college", "education", "coursera", "udemy"],
    patterns: [/tuition/i, /school/i, /university/i, /college/i],
    priority: 7,
  },
  {
    name: "Financial Services",
    keywords: ["bank", "atm", "transfer", "payment", "paypal", "venmo", "zelle", "fee"],
    patterns: [/\bbank\b/i, /\batm\b/i, /transfer/i, /\bfee\b/i],
    priority: 6,
  },
  {
    name: "Personal Care",
    keywords: ["salon", "spa", "gym", "fitness", "beauty", "haircut", "massage"],
    patterns: [/salon/i, /\bgym\b/i, /fitness/i, /spa/i],
    priority: 6,
  },
];

export class CategorizationEngine {
  private taxonomy: Category[];

  constructor(customTaxonomy?: Category[]) {
    this.taxonomy = customTaxonomy || DEFAULT_TAXONOMY;
  }

  /**
   * Main categorization method
   * Uses multi-factor scoring for robust classification
   */
  categorize(transactionText: string): CategorizationResult {
    const normalized = this.normalizeTransaction(transactionText);
    const scores: { category: string; score: number; matches: string[] }[] = [];

    for (const category of this.taxonomy) {
      const { score, matches } = this.calculateScore(normalized, category);
      scores.push({ category: category.name, score, matches });
    }

    // Sort by score descending
    scores.sort((a, b) => b.score - a.score);

    const best = scores[0];
    const confidence = this.calculateConfidence(best.score, scores[1]?.score || 0);

    return {
      category: best.score > 0 ? best.category : "Uncategorized",
      confidence,
      explanation: this.generateExplanation(best.matches, best.category),
      timestamp: new Date(),
    };
  }

  /**
   * Normalize transaction text for better matching
   */
  private normalizeTransaction(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ") // Remove special chars
      .replace(/\s+/g, " ") // Normalize spaces
      .trim();
  }

  /**
   * Calculate category score based on keywords and patterns
   */
  private calculateScore(
    normalized: string,
    category: Category
  ): { score: number; matches: string[] } {
    let score = 0;
    const matches: string[] = [];

    // Keyword matching (exact)
    for (const keyword of category.keywords) {
      if (normalized.includes(keyword.toLowerCase())) {
        score += 10 * category.priority;
        matches.push(keyword);
      }
    }

    // Pattern matching (regex)
    for (const pattern of category.patterns) {
      if (pattern.test(normalized)) {
        score += 5 * category.priority;
        matches.push(`pattern:${pattern.source}`);
      }
    }

    // Partial word matching (for misspellings/variations)
    const words = normalized.split(" ");
    for (const word of words) {
      for (const keyword of category.keywords) {
        if (word.length > 3 && keyword.includes(word)) {
          score += 3;
        }
      }
    }

    return { score, matches };
  }

  /**
   * Calculate confidence based on score difference
   */
  private calculateConfidence(topScore: number, secondScore: number): number {
    if (topScore === 0) return 0.5; // Default low confidence for uncategorized

    const scoreDiff = topScore - secondScore;
    const confidence = Math.min(0.99, 0.75 + scoreDiff / 100);

    return Math.round(confidence * 100) / 100;
  }

  /**
   * Generate human-readable explanation
   */
  private generateExplanation(matches: string[], category: string): string {
    if (matches.length === 0) {
      return "No strong matches found. Consider reviewing manually.";
    }

    const keywordMatches = matches.filter((m) => !m.startsWith("pattern:"));
    if (keywordMatches.length > 0) {
      return `Matched keywords: ${keywordMatches.slice(0, 3).join(", ")}`;
    }

    return `Pattern-based match for ${category}`;
  }

  /**
   * Batch categorization for multiple transactions
   */
  batchCategorize(transactions: string[]): CategorizationResult[] {
    return transactions.map((tx) => this.categorize(tx));
  }

  /**
   * Get taxonomy configuration
   */
  getTaxonomy(): Category[] {
    return this.taxonomy;
  }

  /**
   * Update taxonomy
   */
  updateTaxonomy(newTaxonomy: Category[]): void {
    this.taxonomy = newTaxonomy;
  }
}

// Singleton instance
export const categorizationEngine = new CategorizationEngine();

"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react"

interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  description: string;
  category: string;
  date: string;
  notes?: string;
}

interface TransactionApiResponse {
  transactions: Transaction[];
}

interface Insight {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  type: "warning" | "success" | "info" | "opportunity";
  savings?: string;
}

export function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateInsights();
  }, []);

  const generateInsights = async () => {
    try {
      setIsLoading(true);
      
      // Fetch real transaction data
      const response = await fetch('/api/transactions');
      if (!response.ok) {
        throw new Error('Failed to get transaction data');
      }
      
      // Add proper type assertion here
      const data = await response.json() as TransactionApiResponse;
      const transactions: Transaction[] = data.transactions || [];
      
      // Generate insights based on real data
      const generatedInsights = analyzeTransactions(transactions);
      setInsights(generatedInsights);
      
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights([{
        id: "1",
        title: "Add More Data",
        description: "Upload more transactions to get personalized financial insights and recommendations.",
        priority: "medium",
        type: "info"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeTransactions = (transactions: Transaction[]): Insight[] => {
    const insights: Insight[] = [];

    if (transactions.length === 0) {
      return [{
        id: "no-data",
        title: "No Transaction Data",
        description: "Start by adding some transactions to get personalized financial insights.",
        priority: "medium",
        type: "info"
      }];
    }

    // Calculate basic metrics
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netWorth = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    // Insight 1: Savings Rate Analysis
    if (savingsRate > 20) {
      insights.push({
        id: "savings-excellent",
        title: "Excellent Savings Rate",
        description: `You're saving ${savingsRate.toFixed(1)}% of your income. Consider investing this surplus in index funds or retirement accounts for long-term growth.`,
        priority: "high",
        type: "success"
      });
    } else if (savingsRate > 10) {
      insights.push({
        id: "savings-good",
        title: "Good Savings Habit",
        description: `You're saving ${savingsRate.toFixed(1)}% of your income. Try to increase this to 20% by reducing discretionary spending.`,
        priority: "medium",
        type: "info"
      });
    } else if (savingsRate > 0) {
      insights.push({
        id: "savings-low",
        title: "Low Savings Rate",
        description: `You're only saving ${savingsRate.toFixed(1)}% of your income. Aim for at least 10-20% by reviewing your expenses.`,
        priority: "high",
        type: "warning"
      });
    } else {
      insights.push({
        id: "overspending",
        title: "Spending More Than Earning",
        description: `You're spending $${Math.abs(netWorth).toFixed(2)} more than you earn. Review your expenses immediately to avoid debt.`,
        priority: "high",
        type: "warning"
      });
    }

    // Insight 2: Category Analysis
   // ...existing code...

// Replace the Category Analysis section (around line 105):
// Insight 2: Category Analysis
const expensesByCategory: Record<string, number> = {};
transactions.filter(t => t.type === 'expense').forEach(t => {
  expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
});

const sortedCategories = Object.entries(expensesByCategory)
  .sort(([,a], [,b]) => b - a);

if (sortedCategories.length > 0) {
  const [topCategory, topAmount] = sortedCategories[0];
  const categoryPercentage = (topAmount / totalExpenses) * 100;
  
  // Only flag as "heavy spending" if both percentage AND absolute amount are high
  if (categoryPercentage > 40 && topAmount > 500) {
    insights.push({
      id: "category-heavy",
      title: `Heavy ${topCategory} Spending`,
      description: `${categoryPercentage.toFixed(1)}% of your expenses ($${topAmount.toFixed(2)}) go to ${topCategory}. Consider reducing this category to improve your financial balance.`,
      priority: "medium",
      type: "warning",
      savings: `$${(topAmount * 0.2).toFixed(0)}/mo`
    });
  } else if (sortedCategories.length > 1) {
    // Only show "balanced" if there are multiple categories
    insights.push({
      id: "spending-balanced",
      title: "Balanced Spending",
      description: `Your spending is well-distributed across categories, with ${topCategory} being your largest expense at ${categoryPercentage.toFixed(1)}%.`,
      priority: "low",
      type: "success"
    });
  } else {
    // Single category with low amount - give different advice
    insights.push({
      id: "minimal-expenses",
      title: "Minimal Expense Tracking",
      description: `You have very low expenses ($${totalExpenses.toFixed(2)}). Consider adding more transactions to get better insights, or you're doing great keeping costs low!`,
      priority: "low",
      type: "info"
    });
  }
}

// ...rest of existing code...

    // Insight 3: Transaction Frequency
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    if (expenseTransactions.length > 0) {
      const avgTransactionAmount = totalExpenses / expenseTransactions.length;
      if (avgTransactionAmount > 1000) {
        insights.push({
          id: "large-transactions",
          title: "Large Transaction Pattern",
          description: `Your average expense is $${avgTransactionAmount.toFixed(2)}. Consider breaking down large purchases and budgeting for them in advance.`,
          priority: "medium",
          type: "info"
        });
      }
    }

    // Insight 4: Emergency Fund Recommendation
    const monthlyExpenses = totalExpenses; // Assuming current data is monthly
    const emergencyFundNeeded = monthlyExpenses * 3; // 3-month emergency fund
    
    if (netWorth < emergencyFundNeeded) {
      const shortfall = emergencyFundNeeded - Math.max(netWorth, 0);
      insights.push({
        id: "emergency-fund",
        title: "Build Emergency Fund",
        description: `You need $${shortfall.toFixed(2)} more for a 3-month emergency fund ($${emergencyFundNeeded.toFixed(2)} total). Start by saving $${(shortfall/6).toFixed(2)} monthly.`,
        priority: "high",
        type: "opportunity"
      });
    } else {
      insights.push({
        id: "emergency-fund-good",
        title: "Emergency Fund Complete",
        description: `Great! You have enough savings to cover 3+ months of expenses. Consider investing surplus funds for growth.`,
        priority: "low",
        type: "success"
      });
    }

    return insights.slice(0, 4); // Limit to 4 insights
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'opportunity':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      default:
        return <TrendingDown className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Financial Insights</CardTitle>
          <CardDescription>Analyzing your spending patterns...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Financial Insights</CardTitle>
        <CardDescription>Personalized recommendations based on your spending patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className="flex items-start space-x-3 p-4 rounded-lg border bg-card">
              <div className="flex-shrink-0 mt-0.5">
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-foreground">
                    {insight.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    {insight.savings && (
                      <span className="text-xs font-medium text-green-600">
                        Save {insight.savings}
                      </span>
                    )}
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getPriorityColor(insight.priority)}`}
                    >
                      {insight.priority}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {insight.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
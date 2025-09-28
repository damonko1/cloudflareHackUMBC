"use client"

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react"

interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  description: string;
  category: string;
  date: string;
  notes?: string;
}

// ADD this interface to define the API response
interface TransactionApiResponse {
  transactions: Transaction[];
}

interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsPercentage: number;
  savingsGoal: number;
}

export interface FinancialOverviewRef {
  refreshSummary: () => void;
}

export const FinancialOverview = forwardRef<FinancialOverviewRef>((props, ref) => {
  const [summary, setSummary] = useState<FinancialSummary>({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsPercentage: 0,
    savingsGoal: 20
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchAndCalculateSummary = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/transactions');
      if (response.ok) {
        // ADD proper typing here
        const data = await response.json() as TransactionApiResponse;
        const transactions: Transaction[] = data.transactions || [];
        
        // Calculate summary from transactions
        const totalIncome = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        // Calculate this month's data
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const thisMonthTransactions = transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate.getMonth() === currentMonth && 
                 transactionDate.getFullYear() === currentYear;
        });

        const monthlyIncome = thisMonthTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const monthlyExpenses = thisMonthTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        const totalBalance = totalIncome - totalExpenses;
        const actualSavings = monthlyIncome - monthlyExpenses;
        const savingsPercentage = monthlyIncome > 0 ? (actualSavings / monthlyIncome) * 100 : 0;

        setSummary({
          totalBalance,
          totalIncome,
          totalExpenses,
          monthlyIncome,
          monthlyExpenses,
          savingsPercentage: Math.max(0, savingsPercentage),
          savingsGoal: 20
        });
      }
    } catch (error) {
      console.error('Error fetching transactions for summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndCalculateSummary();
  }, []);

  useImperativeHandle(ref, () => ({
    refreshSummary: fetchAndCalculateSummary
  }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Financial Overview</h2>
        <p className="text-muted-foreground">Your financial health at a glance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalBalance)}</div>
            <p className="text-xs text-muted-foreground">
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.monthlyIncome)}</div>
            <p className="text-xs text-muted-foreground">
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.monthlyExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Goal</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.savingsPercentage.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              of {summary.savingsGoal}% goal
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

FinancialOverview.displayName = 'FinancialOverview';
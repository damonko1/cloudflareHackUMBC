"use client"

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export interface TransactionListRef{
  refreshTransactions: () => void;
}

interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  description: string;
  category: string;
  date: string;
  note?: string; 
}

interface TransactionApiResponse {
  transactions: Transaction[]; 
}

const categoryColors: Record<string, string> = {
  salary: "bg-accent/10 text-accent",
  food: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  transport: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  health: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  shopping: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  bills: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  entertainment: "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
}

const categoryLabels: Record<string, string> = {
  salary: "Salary",
  food: "Food & Dining",
  transport: "Transportation",
  health: "Health & Fitness",
  shopping: "Shopping",
  bills: "Bills & Utilities",
  entertainment: "Entertainment",
  other: "Other",
}

export const TransactionList = forwardRef<TransactionListRef>((props, ref) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/transactions');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transactions (Status: ${response.status})`);
      }
      
      const data = await response.json();
      const apiResponse = data as TransactionApiResponse;
      
      setTransactions(apiResponse.transactions || []);
      
    } catch (error) {
      console.error("Could not fetch data from D1 API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useImperativeHandle(ref, () => ({
    refreshTransactions: fetchTransactions
  }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
        <CardContent><div className="text-center py-12 text-muted-foreground">Loading transactions...</div></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest financial activity</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {transactions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No transactions found in the database.</div>
            ) : (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex flex-col gap-1">
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={categoryColors[transaction.category] || categoryColors.other}>
                            {categoryLabels[transaction.category] || "Other"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{formatDate(transaction.date)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`font-semibold ${transaction.type === "income" ? "text-accent" : "text-foreground"}`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </span>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
});

TransactionList.displayName = 'TransactionList';
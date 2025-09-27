"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Transaction {
  id: string
  amount: number
  type: "income" | "expense"
  description: string
  category: string
  date: string
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    amount: 2500.0,
    type: "income",
    description: "Salary - Tech Corp",
    category: "salary",
    date: "2024-01-15",
  },
  {
    id: "2",
    amount: 85.32,
    type: "expense",
    description: "Grocery shopping at Whole Foods",
    category: "food",
    date: "2024-01-14",
  },
  {
    id: "3",
    amount: 45.0,
    type: "expense",
    description: "Gas station fill-up",
    category: "transport",
    date: "2024-01-13",
  },
  {
    id: "4",
    amount: 120.0,
    type: "expense",
    description: "Monthly gym membership",
    category: "health",
    date: "2024-01-12",
  },
  {
    id: "5",
    amount: 28.75,
    type: "expense",
    description: "Coffee shop - morning latte",
    category: "food",
    date: "2024-01-12",
  },
]

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

export function TransactionList() {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest financial activity</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {mockTransactions.map((transaction) => (
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
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface BudgetCategory {
  name: string
  budgeted: number
  spent: number
  color: string
  status: "under" | "near" | "over"
}

const budgetData: BudgetCategory[] = [
  {
    name: "Food & Dining",
    budgeted: 800,
    spent: 680,
    color: "hsl(var(--chart-1))",
    status: "under",
  },
  {
    name: "Transportation",
    budgeted: 400,
    spent: 420,
    color: "hsl(var(--chart-2))",
    status: "over",
  },
  {
    name: "Shopping",
    budgeted: 500,
    spent: 350,
    color: "hsl(var(--chart-3))",
    status: "under",
  },
  {
    name: "Bills & Utilities",
    budgeted: 550,
    spent: 520,
    color: "hsl(var(--chart-4))",
    status: "under",
  },
  {
    name: "Entertainment",
    budgeted: 300,
    spent: 280,
    color: "hsl(var(--chart-5))",
    status: "near",
  },
]

export function BudgetTracker() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "under":
        return <CheckCircle className="w-4 h-4 text-accent" />
      case "near":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "over":
        return <AlertTriangle className="w-4 h-4 text-destructive" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "under":
        return (
          <Badge variant="outline" className="text-accent border-accent/20 bg-accent/5">
            On Track
          </Badge>
        )
      case "near":
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-200 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-800 dark:bg-yellow-900/20"
          >
            Near Limit
          </Badge>
        )
      case "over":
        return (
          <Badge variant="outline" className="text-destructive border-destructive/20 bg-destructive/5">
            Over Budget
          </Badge>
        )
      default:
        return null
    }
  }

  const totalBudgeted = budgetData.reduce((sum, item) => sum + item.budgeted, 0)
  const totalSpent = budgetData.reduce((sum, item) => sum + item.spent, 0)
  const overallProgress = (totalSpent / totalBudgeted) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Tracker</CardTitle>
        <CardDescription>Monitor your spending against your budget goals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Budget Progress</span>
            <span className="font-medium">
              ${totalSpent.toLocaleString()} / ${totalBudgeted.toLocaleString()}
            </span>
          </div>
          <Progress value={overallProgress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {overallProgress < 100
              ? `${(100 - overallProgress).toFixed(1)}% remaining`
              : `${(overallProgress - 100).toFixed(1)}% over budget`}
          </p>
        </div>

        <div className="space-y-4">
          {budgetData.map((category, index) => {
            const progress = (category.spent / category.budgeted) * 100
            const remaining = category.budgeted - category.spent

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(category.status)}
                    <span className="font-medium text-sm">{category.name}</span>
                  </div>
                  {getStatusBadge(category.status)}
                </div>

                <div className="space-y-1">
                  <Progress value={Math.min(progress, 100)} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>${category.spent.toLocaleString()} spent</span>
                    <span>
                      {remaining >= 0
                        ? `$${remaining.toLocaleString()} left`
                        : `$${Math.abs(remaining).toLocaleString()} over`}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

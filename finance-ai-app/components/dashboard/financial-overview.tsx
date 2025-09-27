"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react"

const stats = [
  {
    title: "Total Balance",
    value: "$12,847.32",
    change: "+2.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Monthly Income",
    value: "$6,500.00",
    change: "+8.2%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Monthly Expenses",
    value: "$2,216.48",
    change: "-3.1%",
    trend: "down",
    icon: TrendingDown,
  },
  {
    title: "Savings Goal",
    value: "68%",
    change: "+12%",
    trend: "up",
    icon: Target,
  },
]

export function FinancialOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-balance">Financial Overview</h2>
        <p className="text-muted-foreground">Your financial health at a glance</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs">
                {stat.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 text-accent" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-destructive" />
                )}
                <span className={stat.trend === "up" ? "text-accent" : "text-destructive"}>{stat.change}</span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

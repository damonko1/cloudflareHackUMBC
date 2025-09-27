"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const monthlyData = [
  { month: "Jan", income: 6500, expenses: 2200, savings: 4300 },
  { month: "Feb", income: 6500, expenses: 2450, savings: 4050 },
  { month: "Mar", income: 6800, expenses: 2100, savings: 4700 },
  { month: "Apr", income: 6500, expenses: 2350, savings: 4150 },
  { month: "May", income: 7000, expenses: 2600, savings: 4400 },
  { month: "Jun", income: 6500, expenses: 2216, savings: 4284 },
]

const categoryData = [
  { name: "Food & Dining", value: 680, color: "hsl(var(--chart-1))" },
  { name: "Transportation", value: 420, color: "hsl(var(--chart-2))" },
  { name: "Shopping", value: 350, color: "hsl(var(--chart-3))" },
  { name: "Bills & Utilities", value: 520, color: "hsl(var(--chart-4))" },
  { name: "Entertainment", value: 246, color: "hsl(var(--chart-5))" },
]

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--accent))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-2))",
  },
  savings: {
    label: "Savings",
    color: "hsl(var(--chart-1))",
  },
}

export function SpendingChart() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>Income, expenses, and savings over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="income" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="savings" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>Where your money goes this month</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-medium">{data.name}</p>
                          <p className="text-sm text-muted-foreground">${data.value.toLocaleString()}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-4 space-y-2">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

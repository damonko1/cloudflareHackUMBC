"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Lightbulb, AlertTriangle, TrendingUp, Target } from "lucide-react"

const insights = [
  {
    type: "suggestion",
    icon: Lightbulb,
    title: "Optimize Coffee Spending",
    description:
      "You spent $87 on coffee this month. Brewing at home 3 days a week could save you $35/month ($420/year).",
    action: "Set Reminder",
    priority: "medium",
    savings: 35,
  },
  {
    type: "alert",
    icon: AlertTriangle,
    title: "Transportation Over Budget",
    description: "You're $20 over your transportation budget. Consider carpooling or using public transit more often.",
    action: "Review Expenses",
    priority: "high",
    savings: 20,
  },
  {
    type: "opportunity",
    icon: TrendingUp,
    title: "Investment Opportunity",
    description: "With your 66% savings rate, consider investing $500/month in index funds for long-term growth.",
    action: "Learn More",
    priority: "high",
    savings: null,
  },
  {
    type: "goal",
    icon: Target,
    title: "Emergency Fund Progress",
    description: "You're 68% toward your emergency fund goal. At your current rate, you'll reach it in 3 months.",
    action: "Stay on Track",
    priority: "low",
    savings: null,
  },
]

const quickActions = [
  {
    title: "Budget Review",
    description: "Analyze this month's spending patterns",
    icon: Target,
    action: "Start Review",
  },
  {
    title: "Savings Plan",
    description: "Create a personalized savings strategy",
    icon: Target,
    action: "Build Plan",
  },
  {
    title: "Investment Advice",
    description: "Get recommendations for your portfolio",
    icon: TrendingUp,
    action: "Get Advice",
  },
]

export function AIInsights() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "suggestion":
        return "bg-accent/10 text-accent"
      case "alert":
        return "bg-destructive/10 text-destructive"
      case "opportunity":
        return "bg-chart-1/10 text-chart-1"
      case "goal":
        return "bg-chart-2/10 text-chart-2"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Financial Insights
        </CardTitle>
        <CardDescription>Personalized recommendations based on your spending patterns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {insights.map((insight, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeColor(insight.type)}`}>
                <insight.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                  <div className="flex items-center gap-2">
                    {insight.savings && (
                      <Badge variant="outline" className="text-xs bg-accent/5 text-accent border-accent/20">
                        Save ${insight.savings}/mo
                      </Badge>
                    )}
                    <Badge variant="outline" className={`text-xs ${getPriorityColor(insight.priority)}`}>
                      {insight.priority}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                <Button variant="outline" size="sm" className="text-xs bg-transparent">
                  {insight.action}
                </Button>
              </div>
            </div>
            {index < insights.length - 1 && <div className="border-b border-border" />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

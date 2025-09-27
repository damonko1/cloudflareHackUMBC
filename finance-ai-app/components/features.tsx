import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Brain, BarChart3, Shield, Zap, Target } from "lucide-react"

const features = [
  {
    icon: Upload,
    title: "Smart File Upload",
    description:
      "Upload bank statements, CSV files, or receipts. Our AI automatically categorizes and analyzes your transactions.",
  },
  {
    icon: Brain,
    title: "AI Financial Coach",
    description: "Get personalized insights and recommendations based on your spending patterns and financial goals.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Visualize your spending trends, track budgets, and discover insights with interactive charts and reports.",
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description: "Set financial goals and let our AI help you create actionable plans to achieve them faster.",
  },
  {
    icon: Zap,
    title: "Real-time Insights",
    description: "Get instant feedback on your spending decisions and receive alerts for unusual transactions.",
  },
  {
    icon: Shield,
    title: "Bank-level Security",
    description: "Your financial data is encrypted and protected with enterprise-grade security measures.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-balance">Everything you need to master your finances</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Powerful AI-driven tools to help you understand, optimize, and grow your wealth
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

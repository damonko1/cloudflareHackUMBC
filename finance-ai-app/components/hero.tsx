import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, Brain, BarChart3 } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                Finance without
                <span className="text-accent"> the middleman</span>
              </h1>
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                Take control of your financial future with AI-powered insights. Upload your transactions or enter them
                manually to get personalized coaching and deep financial analytics.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/dashboard">
                  Start Analyzing <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                View Demo
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground">Upload & Analyze</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground">AI Coaching</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground">Smart Insights</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative bg-card border border-border rounded-2xl p-6 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Monthly Overview</h3>
                  <span className="text-2xl font-bold text-accent">$4,284</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Income</span>
                    <span className="text-sm font-medium text-accent">+$6,500</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Expenses</span>
                    <span className="text-sm font-medium">-$2,216</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-accent rounded-full"></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Brain className="w-4 h-4" />
                    <span>AI suggests reducing dining out by 15% to save $180/month</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/5 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

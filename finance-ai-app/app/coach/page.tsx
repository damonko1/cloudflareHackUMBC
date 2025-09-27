import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AIChat } from "@/components/dashboard/ai-chat"
import { AIInsights } from "@/components/dashboard/ai-insights"

export default function CoachPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-balance">AI Financial Coach</h1>
            <p className="text-muted-foreground">Get personalized financial advice and actionable insights</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AIChat />
            </div>
            <div>
              <AIInsights />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

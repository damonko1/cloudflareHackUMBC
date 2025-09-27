import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SpendingChart } from "@/components/dashboard/spending-chart"
import { BudgetTracker } from "@/components/dashboard/budget-tracker"
import { FinancialOverview } from "@/components/dashboard/financial-overview"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-balance">Financial Analytics</h1>
            <p className="text-muted-foreground">Deep insights into your financial patterns and progress</p>
          </div>

          <FinancialOverview />
          <SpendingChart />

          <div className="max-w-2xl">
            <BudgetTracker />
          </div>
        </div>
      </main>
    </div>
  )
}

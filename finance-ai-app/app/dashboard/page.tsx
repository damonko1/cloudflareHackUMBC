import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UploadSection } from "@/components/dashboard/upload-section"
import { TransactionForm } from "@/components/dashboard/transaction-form"
import { TransactionList } from "@/components/dashboard/transaction-list"
import { FinancialOverview } from "@/components/dashboard/financial-overview"
import { AIInsights } from "@/components/dashboard/ai-insights"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <FinancialOverview />
            <div className="grid md:grid-cols-2 gap-6">
              <UploadSection />
              <TransactionForm />
            </div>
            <TransactionList />
          </div>
          <div className="space-y-6">
            <AIInsights />
          </div>
        </div>
      </main>
    </div>
  )
}

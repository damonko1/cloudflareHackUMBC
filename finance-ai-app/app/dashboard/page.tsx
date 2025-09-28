"use client"

import { useRef } from 'react';
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UploadSection } from "@/components/dashboard/upload-section"
import { TransactionForm } from "@/components/dashboard/transaction-form"
import { TransactionList, TransactionListRef } from "@/components/dashboard/transaction-list"
import { FinancialOverview, FinancialOverviewRef } from "@/components/dashboard/financial-overview"
import { AIInsights } from "@/components/dashboard/ai-insights"

export default function DashboardPage() {
  const transactionListRef = useRef<TransactionListRef>(null);
  const financialOverviewRef = useRef<FinancialOverviewRef>(null);

  const handleTransactionAdded = () => {
    // Refresh both components when a new transaction is added
    transactionListRef.current?.refreshTransactions();
    financialOverviewRef.current?.refreshSummary();
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <FinancialOverview ref={financialOverviewRef} />
            <div className="grid md:grid-cols-2 gap-6">
              <UploadSection />
              <TransactionForm onTransactionAdded={handleTransactionAdded} />
            </div>
            <TransactionList ref={transactionListRef} />
          </div>
          <div className="space-y-6">
            <AIInsights />
          </div>
        </div>
      </main>
    </div>
  )
}
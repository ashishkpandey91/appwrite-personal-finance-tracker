import { Skeleton } from "@/components/ui/skeleton"
import { OverviewCardSkeleton } from "./CardSkeleton"
import { SpendingChartSkeleton, CategoryChartSkeleton } from "./ChartSkeleton"
import { TransactionListSkeleton } from "./TransactionSkeleton"
import { BudgetListSkeleton } from "./BudgetSkeleton"

export function DashboardPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OverviewCardSkeleton />
        <OverviewCardSkeleton />
        <OverviewCardSkeleton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChartSkeleton />
        <CategoryChartSkeleton />
      </div>

      <TransactionListSkeleton />
    </div>
  )
}

export function BudgetPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BudgetListSkeleton />
      </div>
    </div>
  )
}

export function FullPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-32" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <DashboardPageSkeleton />
      </div>
    </div>
  )
}
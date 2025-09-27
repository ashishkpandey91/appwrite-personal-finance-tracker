import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function BudgetCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <Skeleton className="h-5 w-24 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-2 w-full rounded-full" />
          <div className="flex justify-between text-sm">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function BudgetListSkeleton() {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <BudgetCardSkeleton key={i} />
      ))}
    </>
  )
}
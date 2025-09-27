import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24 mt-1" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-28 mt-2" />
      </CardContent>
    </Card>
  )
}

export function OverviewCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-3 w-40 mt-1" />
      </CardContent>
    </Card>
  )
}
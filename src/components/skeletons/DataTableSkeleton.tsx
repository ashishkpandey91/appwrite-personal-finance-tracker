import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function DataTableSkeleton({
  rows = 10,
  columns = 5,
  showHeader = true,
  showPagination = true
}: {
  rows?: number
  columns?: number
  showHeader?: boolean
  showPagination?: boolean
}) {
  return (
    <Card className="w-full">
      {showHeader && (
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="rounded-md border">
          <div className="border-b bg-muted/50">
            <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {[...Array(columns)].map((_, i) => (
                <div key={i} className="p-3">
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>

          <div>
            {[...Array(rows)].map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid border-b last:border-0"
                style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
              >
                {[...Array(columns)].map((_, colIndex) => (
                  <div key={colIndex} className="p-3">
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showPagination && (
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
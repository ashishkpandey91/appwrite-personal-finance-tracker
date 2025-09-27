import { Skeleton } from "@/components/ui/skeleton"

export function HeaderSkeleton() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
    </header>
  )
}

export function PageHeaderSkeleton() {
  return (
    <div className="mb-8">
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-96" />
    </div>
  )
}
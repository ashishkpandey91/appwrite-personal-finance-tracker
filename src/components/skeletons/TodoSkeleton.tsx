import { Skeleton } from "@/components/ui/skeleton";

export function TodoItemSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-start gap-3">
        <Skeleton className="h-5 w-5 rounded mt-1" />
        <div className="flex-1">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-3 w-24 mt-2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    </div>
  );
}

export function TodoListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Todo Items Skeleton */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <TodoItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

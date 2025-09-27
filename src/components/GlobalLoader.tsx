import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface GlobalLoaderProps {
  isLoading: boolean
  message?: string
  fullScreen?: boolean
}

export function GlobalLoader({
  isLoading,
  message = "Loading...",
  fullScreen = true
}: GlobalLoaderProps) {
  if (!isLoading) return null

  return (
    <div
      className={cn(
        "flex items-center justify-center bg-background/80 backdrop-blur-sm z-50",
        fullScreen ? "fixed inset-0" : "absolute inset-0"
      )}
    >
      <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg shadow-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}

export function PageLoader({ message = "Loading page..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-primary/20"></div>
          <div className="absolute top-0 h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
        <p className="text-lg text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}
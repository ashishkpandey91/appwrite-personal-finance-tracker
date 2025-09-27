import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingStateProps {
  message?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingState({
  message = "Loading...",
  className,
  size = "md"
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  }

  const textClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }

  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)}>
      <Loader2 className={cn("animate-spin text-primary mb-4", sizeClasses[size])} />
      <p className={cn("text-muted-foreground", textClasses[size])}>{message}</p>
    </div>
  )
}

export function InlineLoadingState({
  message = "Loading...",
  className
}: {
  message?: string
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm text-muted-foreground">{message}</span>
    </div>
  )
}

export function ButtonLoadingState({
  message = "Loading..."
}: {
  message?: string
}) {
  return (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {message}
    </>
  )
}
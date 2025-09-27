import { useNetworkStatus } from "@/hooks/useNetworkStatus"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WifiOff, Wifi } from "lucide-react"
import { useEffect, useState } from "react"

export function NetworkStatus() {
  const { isOnline, wasOffline } = useNetworkStatus()
  const [showBackOnline, setShowBackOnline] = useState(false)

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowBackOnline(true)
      const timer = setTimeout(() => {
        setShowBackOnline(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, wasOffline])

  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 animate-slide-down">
        <Alert className="rounded-none border-0 bg-red-500 text-white">
          <WifiOff className="h-4 w-4" />
          <AlertDescription className="text-white">
            You are currently offline. Some features may be limited.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (showBackOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 animate-slide-down">
        <Alert className="rounded-none border-0 bg-green-500 text-white">
          <Wifi className="h-4 w-4" />
          <AlertDescription className="text-white">
            You're back online!
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return null
}
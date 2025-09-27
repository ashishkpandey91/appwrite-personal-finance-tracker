import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Download, Smartphone } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isInStandaloneMode, setIsInStandaloneMode] = useState(false)

  useEffect(() => {
    // Check if app is already installed or in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://')

    setIsInStandaloneMode(isStandalone)

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show prompt after a delay if user hasn't dismissed it before
      const hasBeenDismissed = localStorage.getItem('pwa-install-dismissed')
      const dismissedTime = hasBeenDismissed ? parseInt(hasBeenDismissed) : 0
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24)

      if (!hasBeenDismissed || daysSinceDismissed > 7) {
        setTimeout(() => setShowInstallPrompt(true), 3000)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check if app was installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    await deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
      setIsInstalled(true)
    } else {
      console.log('User dismissed the install prompt')
    }

    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
    setShowInstallPrompt(false)
  }

  // Don't show anything if already installed or in standalone mode
  if (isInStandaloneMode || isInstalled) {
    return null
  }

  // iOS specific prompt
  if (isIOS && showInstallPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up md:left-auto md:max-w-md">
        <Alert className="border-blue-200 bg-blue-50">
          <Smartphone className="h-4 w-4" />
          <AlertDescription className="flex flex-col gap-2">
            <span className="font-semibold">Install Finance Tracker</span>
            <span className="text-sm">
              Tap the share button <span className="inline-block px-1">⎙</span> and then
              "Add to Home Screen" to install this app.
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="self-end"
              onClick={handleDismiss}
            >
              Got it
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Android/Desktop Chrome prompt
  if (showInstallPrompt && deferredPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up md:left-auto md:max-w-md">
        <Card className="border-blue-200 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Install App</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleDismiss}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Install Finance Tracker for quick access and offline use
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Access your finances instantly</li>
              <li>• Works offline</li>
              <li>• Get notifications for budget alerts</li>
            </ul>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              className="flex-1"
            >
              Not Now
            </Button>
            <Button
              size="sm"
              onClick={handleInstallClick}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Install
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return null
}

// Add slide-up animation to your global CSS
const style = document.createElement('style')
style.textContent = `
  @keyframes slide-up {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  .animate-slide-up {
    animation: slide-up 0.3s ease-out;
  }
`
document.head.appendChild(style)
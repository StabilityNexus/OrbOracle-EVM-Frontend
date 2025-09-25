import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-6 pt-32 pb-20 text-center">
        <div className="max-w-2xl mx-auto">
          <Search className="h-20 w-20 mx-auto mb-8 text-primary/30" />
          <h1 className="text-5xl font-light tracking-tight mb-6 bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
            Oracle Not Found
          </h1>
          <p className="text-xl text-muted-foreground/80 font-light mb-12 leading-relaxed">
            The oracle you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="h-12 px-6 bg-primary/90 hover:bg-primary text-white font-medium rounded-xl">
              <Link href="/explorer">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Explorer
              </Link>
            </Button>
            <button className="h-12 px-6 text-primary hover:text-primary/80 transition-colors font-medium">
              <Link href="/">Go Home</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

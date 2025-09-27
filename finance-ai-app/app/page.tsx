import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Navigation } from "@/components/navigation"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <Features />
      </main>
    </div>
  )
}

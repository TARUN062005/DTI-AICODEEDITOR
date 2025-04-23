import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function HeroSection() {
  return (
    <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Collaborative AI-Powered Code Editor
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Write, share, and collaborate on code in real-time with AI assistance. Support for multiple programming
          languages and integrated chat.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/auth/register">
            <Button size="lg" className="h-12 px-8 text-lg">
              Get Started
              <Icons.arrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
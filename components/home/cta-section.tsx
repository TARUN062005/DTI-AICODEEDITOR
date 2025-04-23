import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="container py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Ready to supercharge your coding?
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Join thousands of developers who are already using CodeCollab to build amazing projects.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg">Open Dashboard</Button>
          </Link>
          <Link href="/editor/new">
            <Button variant="outline" size="lg">
              Create New Project
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

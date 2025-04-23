import { Icons } from "@/components/icons"

export function FeaturesSection() {
  return (
    <section id="features" className="container space-y-6 py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Our AI-powered code editor comes with everything you need to collaborate effectively.
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
            <Icons.code className="h-12 w-12 text-primary" />
            <div className="space-y-2">
              <h3 className="font-bold">Syntax Highlighting</h3>
              <p className="text-sm text-muted-foreground">
                Support for multiple programming languages with syntax highlighting.
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
            <Icons.users className="h-12 w-12 text-primary" />
            <div className="space-y-2">
              <h3 className="font-bold">Real-time Collaboration</h3>
              <p className="text-sm text-muted-foreground">
                Work together with your team in real-time on the same codebase.
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
            <Icons.messageSquare className="h-12 w-12 text-primary" />
            <div className="space-y-2">
              <h3 className="font-bold">Integrated Chat</h3>
              <p className="text-sm text-muted-foreground">Communicate with your team without leaving the editor.</p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
            <Icons.terminal className="h-12 w-12 text-primary" />
            <div className="space-y-2">
              <h3 className="font-bold">Integrated Terminal</h3>
              <p className="text-sm text-muted-foreground">Run commands and see output directly in the editor.</p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
            <Icons.gitBranch className="h-12 w-12 text-primary" />
            <div className="space-y-2">
              <h3 className="font-bold">Version Control</h3>
              <p className="text-sm text-muted-foreground">Integrated Git support for managing your code versions.</p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
            <Icons.cpu className="h-12 w-12 text-primary" />
            <div className="space-y-2">
              <h3 className="font-bold">AI Assistance</h3>
              <p className="text-sm text-muted-foreground">
                Get intelligent code suggestions and help from our AI assistant.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

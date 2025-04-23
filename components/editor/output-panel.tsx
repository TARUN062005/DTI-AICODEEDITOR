"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface OutputPanelProps {
  output: string
}

export function OutputPanel({ output }: OutputPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="text-xs font-medium">Output</div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Icons.trash className="h-3.5 w-3.5" />
            <span className="sr-only">Clear Output</span>
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <pre className="font-mono text-xs">{output || "Run your code to see output here"}</pre>
      </ScrollArea>
    </div>
  )
}

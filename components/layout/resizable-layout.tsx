"use client"

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { Terminal } from "../terminal"

export function ResizableLayout({ children }: { children: React.ReactNode }) {
  return (
    <PanelGroup direction="vertical">
      <Panel defaultSize={70} minSize={30}>
        {children} {/* Your editor content */}
      </Panel>
      <PanelResizeHandle className="h-2 bg-gray-800 hover:bg-gray-700 transition-colors" />
      <Panel defaultSize={30} minSize={10} maxSize={50}>
        <Terminal />
      </Panel>
    </PanelGroup>
  )
}
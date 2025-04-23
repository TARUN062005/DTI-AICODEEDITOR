"use client"

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Input } from "@/components/ui/input"
const TerminalCore = dynamic(
  () => import('./terminal-core').then((mod) => mod.TerminalCore),
  {
    ssr: false,
    loading: () => <div className="flex-1 p-2 bg-gray-100" />,
  }
)
export function Terminal() {
  return (
    <div className="bg-black text-white p-4">
      {/* Terminal implementation */}
    </div>
  )
}

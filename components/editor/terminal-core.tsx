// components/editor/terminal-core.tsx
"use client";

import { useEffect, useRef } from 'react'
import { TerminalService } from '@/lib/terminal-service'

export function TerminalCore() {
  const terminalRef = useRef<HTMLDivElement>(null)
  const terminalService = useRef<TerminalService | null>(null)

  useEffect(() => {
    if (terminalRef.current && typeof window !== 'undefined') {
      terminalService.current = new TerminalService()
      terminalService.current.init(terminalRef.current)
    }

    return () => {
      terminalService.current?.destroy()
    }
  }, [])

  return <div ref={terminalRef} className="flex-1 p-2" />
}
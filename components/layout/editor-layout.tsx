"use client"

import { useState } from 'react'
import { Terminal } from '../editor/terminal'; 

export function EditorLayout({ children }: { children: React.ReactNode }) {
  const [showTerminal, setShowTerminal] = useState(false)

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
      
      {showTerminal && (
        <Terminal onClose={() => setShowTerminal(false)} />
      )}

      <div className="flex items-center justify-between h-8 px-4 bg-gray-800 border-t border-gray-700">
        <div className="text-xs text-gray-400">Ready</div>
        <button 
          onClick={() => setShowTerminal(!showTerminal)}
          className="text-xs text-gray-400 hover:text-white"
        >
          {showTerminal ? "Hide Terminal" : "Show Terminal"}
        </button>
      </div>
    </div>
  )
}
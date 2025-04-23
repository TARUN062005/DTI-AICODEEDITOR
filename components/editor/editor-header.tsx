"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from "next-themes"

interface EditorHeaderProps {
  projectName: string
  fileName: string
  onSave: () => void
  onRun: () => void
  onToggleAI: () => void
  onToggleTerminal: () => void
}

export function EditorHeader({
  projectName,
  fileName,
  onSave,
  onRun,
  onToggleAI,
  onToggleTerminal,
}: EditorHeaderProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [isRunning, setIsRunning] = useState(false)

  const handleRun = () => {
    setIsRunning(true)
    onRun()
    setTimeout(() => setIsRunning(false), 1000)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="flex h-12 items-center justify-between border-b border-slate-800 bg-slate-900 px-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard")}
          className="h-8 w-8 text-slate-400 hover:text-slate-200"
        >
          <Icons.chevronLeft className="h-4 w-4" />
          <span className="sr-only">Back to Dashboard</span>
        </Button>

        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="font-medium">AICODE EDITOR</span>
          {fileName && (
            <>
              <Icons.chevronRight className="h-3 w-3 text-slate-500" />
              <span className="text-slate-400">{fileName}</span>
            </>
          )}
        </div>
      </div>

      <TooltipProvider>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-slate-200"
                onClick={onSave}
              >
                <Icons.save className="h-4 w-4" />
                <span className="sr-only">Save</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save (Ctrl+S)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isRunning ? "default" : "ghost"}
                size="icon"
                className={`h-8 w-8 ${isRunning ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
                onClick={handleRun}
                disabled={isRunning}
              >
                {isRunning ? <Icons.spinner className="h-4 w-4 animate-spin" /> : <Icons.play className="h-4 w-4" />}
                <span className="sr-only">Run</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Run Code</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-slate-200"
                onClick={onToggleTerminal}
              >
                <Icons.terminal className="h-4 w-4" />
                <span className="sr-only">Toggle Terminal</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Terminal</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-slate-200"
                onClick={onToggleAI}
              >
                <Icons.cpu className="h-4 w-4" />
                <span className="sr-only">AI Assistant</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>AI Assistant</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-slate-200"
                onClick={toggleTheme}
              >
                {theme === "dark" ? <Icons.sun className="h-4 w-4" /> : <Icons.moon className="h-4 w-4" />}
                <span className="sr-only">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{theme === "dark" ? "Light Mode" : "Dark Mode"}</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-200">
                <Icons.settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-300">
              <DropdownMenuItem className="hover:bg-slate-800">
                <Icons.keyboard className="mr-2 h-4 w-4" />
                <span>Keyboard Shortcuts</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-slate-800">
                <Icons.settings className="mr-2 h-4 w-4" />
                <span>Editor Settings</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TooltipProvider>
    </div>
  )
}

"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface CodeEditorProps {
  content: string
  language: string
  onChange: (content: string) => void
  theme?: "light" | "dark"
}

export function CodeEditor({ content, language, onChange, theme = "dark" }: CodeEditorProps) {
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [lineNumbers, setLineNumbers] = useState<string[]>([])

  // Update line numbers when content changes
  useEffect(() => {
    const lines = content.split("\n")
    setLineNumbers(Array.from({ length: lines.length }, (_, i) => (i + 1).toString()))
  }, [content])

  // Handle tab key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const target = e.target as HTMLTextAreaElement
      const start = target.selectionStart
      const end = target.selectionEnd

      // Insert 2 spaces for tab
      const newValue = target.value.substring(0, start) + "  " + target.value.substring(end)

      // Update the value
      onChange(newValue)

      // This is executed after React updates the input value
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2
        }
      }, 0)
    }
  }

  // Update cursor position
  const updateCursorPosition = (
    e: React.MouseEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    const target = e.target as HTMLTextAreaElement
    const cursorPos = target.selectionStart
    const textBeforeCursor = target.value.substring(0, cursorPos)
    const lines = textBeforeCursor.split("\n")

    setCursorPosition({
      line: lines.length,
      column: lines[lines.length - 1].length + 1,
    })
  }

  // Get syntax highlighting class based on language
  const getSyntaxClass = () => {
    const lang = language.toLowerCase()
    switch (lang) {
      case "js":
      case "jsx":
      case "javascript":
        return "language-javascript"
      case "ts":
      case "tsx":
      case "typescript":
        return "language-typescript"
      case "html":
        return "language-html"
      case "css":
        return "language-css"
      case "json":
        return "language-json"
      case "md":
      case "markdown":
        return "language-markdown"
      case "py":
      case "python":
        return "language-python"
      case "java":
        return "language-java"
      case "c":
      case "cpp":
      case "c++":
        return "language-cpp"
      case "go":
        return "language-go"
      case "rust":
        return "language-rust"
      case "php":
        return "language-php"
      default:
        return "language-plaintext"
    }
  }

  return (
    <div className={`flex flex-col h-full ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
      <div className="flex-1 relative overflow-hidden">
        <div className="flex h-full">
          {/* Line numbers */}
          <div
            className={`w-12 flex-shrink-0 select-none py-4 text-right pr-2 font-mono text-xs ${
              theme === "dark" ? "bg-slate-950 text-slate-500" : "bg-slate-100 text-slate-500"
            }`}
          >
            {lineNumbers.map((num, i) => (
              <div key={i} className="leading-5">
                {num}
              </div>
            ))}
          </div>

          {/* Editor area */}
          <div className="h-full w-full overflow-auto">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                  handleKeyDown(e)
                  updateCursorPosition(e)
                }}
                onClick={updateCursorPosition}
                className={`w-full h-full p-4 pl-0 font-mono text-sm resize-none outline-none absolute top-0 left-0 z-10 ${
                  theme === "dark"
                    ? "bg-transparent text-slate-200 caret-white"
                    : "bg-transparent text-slate-800 caret-black"
                }`}
                style={{
                  lineHeight: "1.25rem",
                  tabSize: 2,
                  caretColor: theme === "dark" ? "white" : "black",
                }}
                spellCheck="false"
              />

              {/* Syntax highlighting layer (simplified) */}
              <pre
                className={`w-full p-4 pl-0 font-mono text-sm whitespace-pre ${getSyntaxClass()} pointer-events-none ${
                  theme === "dark" ? "text-slate-200" : "text-slate-800"
                }`}
                style={{ lineHeight: "1.25rem", tabSize: 2 }}
                aria-hidden="true"
              >
                {content || " "}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div
        className={`h-6 text-xs px-4 flex items-center justify-between ${
          theme === "dark" ? "bg-slate-800 text-slate-400" : "bg-slate-200 text-slate-600"
        }`}
      >
        <div className="flex items-center gap-4">
          <div>
            Ln {cursorPosition.line}, Col {cursorPosition.column}
          </div>
          <div className="capitalize">{language || "Plain Text"}</div>
        </div>
        <div className="flex items-center gap-4">
          <div>Spaces: 2</div>
          <div>UTF-8</div>
          <div>LF</div>
        </div>
      </div>
      {/* Add a floating theme toggle button */}
      <div className="absolute bottom-10 right-4 z-10">
        <button
          onClick={() => onChange(content)} // This will trigger a re-render with the current theme
          className={`p-2 rounded-full ${
            theme === "dark" ? "bg-slate-700 text-slate-200" : "bg-slate-200 text-slate-700"
          }`}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </div>
  )
}

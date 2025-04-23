"use client"
import CodeEditor from "@/components/code-editor/code-editor"
import { ThemeProvider } from "@/components/theme-provider"

export default function CodeEditorPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <main className="min-h-screen">
        <CodeEditor />
      </main>
    </ThemeProvider>
  )
}

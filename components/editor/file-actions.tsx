"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

interface FileActionsProps {
  onAddFile: (fileName: string) => void
}

export function FileActions({ onAddFile }: FileActionsProps) {
  const [newFileName, setNewFileName] = useState("")

  const handleAddFile = () => {
    if (newFileName.trim()) {
      onAddFile(newFileName)
      setNewFileName("")
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="text"
        placeholder="New file name (e.g., style.css)"
        value={newFileName}
        onChange={(e) => setNewFileName(e.target.value)}
        className="flex-1 bg-slate-800 text-slate-200 placeholder:text-slate-500"
      />
      <Button size="sm" onClick={handleAddFile} className="bg-emerald-600 text-white hover:bg-emerald-700">
        <Plus className="h-4 w-4 mr-2" />
        Add File
      </Button>
    </div>
  )
}

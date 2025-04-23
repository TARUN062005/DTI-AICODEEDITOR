"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export type FileType = {
  id: string
  name: string
  type: "file" | "directory"
  content?: string
  children?: FileType[]
  extension?: string
  path: string
  parentId?: string | null
}

interface FileExplorerProps {
  files: FileType[]
  selectedFile: string | null
  onSelectFile: (path: string) => void
  onCreateFile: (name: string, type: "file" | "directory", parentPath: string) => void
  onDeleteFile: (path: string) => void
  onRenameFile: (path: string, newName: string) => void
  expandedFolders?: Record<string, boolean>
  onToggleFolder?: (folders: Record<string, boolean>) => void
}

export function FileExplorer({
  files,
  selectedFile,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  onRenameFile,
  expandedFolders: propExpandedFolders,
  onToggleFolder,
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>(propExpandedFolders || {})
  const [isCreatingFile, setIsCreatingFile] = useState(false)
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [newItemName, setNewItemName] = useState("")
  const [currentPath, setCurrentPath] = useState("")
  const [fileType, setFileType] = useState("js")

  const toggleFolder = (path: string) => {
    const newExpandedFolders = {
      ...expandedFolders,
      [path]: !expandedFolders[path],
    }

    setExpandedFolders(newExpandedFolders)
    if (onToggleFolder) {
      onToggleFolder(newExpandedFolders)
    }
  }

  const handleCreateFile = () => {
    if (!newItemName.trim()) return

    // Add file extension if not provided
    let fileName = newItemName
    if (!fileName.includes(".") && fileType) {
      fileName = `${fileName}.${fileType}`
    }

    onCreateFile(fileName, "file", currentPath)
    setNewItemName("")
    setIsCreatingFile(false)
  }

  const handleCreateFolder = () => {
    if (!newItemName.trim()) return
    onCreateFile(newItemName, "directory", currentPath)
    setNewItemName("")
    setIsCreatingFolder(false)
  }

  const handleRenameFile = () => {
    if (!newItemName.trim()) return
    onRenameFile(currentPath, newItemName)
    setNewItemName("")
    setIsRenaming(false)
  }

  const getFileIcon = (file: FileType) => {
    if (file.type === "directory") {
      return expandedFolders[file.path] ? (
        <Icons.folderOpen className="h-4 w-4 mr-2" />
      ) : (
        <Icons.folder className="h-4 w-4 mr-2" />
      )
    }

    const extension = file.name.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "js":
        return <Icons.fileJs className="h-4 w-4 mr-2 text-yellow-400" />
      case "jsx":
        return <Icons.fileJsx className="h-4 w-4 mr-2 text-blue-400" />
      case "ts":
        return <Icons.fileTs className="h-4 w-4 mr-2 text-blue-600" />
      case "tsx":
        return <Icons.fileTsx className="h-4 w-4 mr-2 text-blue-500" />
      case "html":
        return <Icons.fileHtml className="h-4 w-4 mr-2 text-orange-500" />
      case "css":
        return <Icons.fileCss className="h-4 w-4 mr-2 text-blue-400" />
      case "json":
        return <Icons.fileJson className="h-4 w-4 mr-2 text-yellow-300" />
      case "md":
        return <Icons.fileMd className="h-4 w-4 mr-2 text-slate-400" />
      case "svg":
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return <Icons.image className="h-4 w-4 mr-2 text-purple-400" />
      default:
        return <Icons.file className="h-4 w-4 mr-2" />
    }
  }

  const renderFileTree = (items: FileType[], depth = 0) => {
    return items.map((item) => (
      <div key={item.id} style={{ paddingLeft: `${depth * 12}px` }}>
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={cn(
                "flex items-center py-1 px-2 rounded-md text-sm cursor-pointer hover:bg-slate-800 group",
                selectedFile === item.path && "bg-slate-800 text-white",
              )}
              onClick={() => {
                if (item.type === "directory") {
                  toggleFolder(item.path)
                } else {
                  onSelectFile(item.path)
                }
              }}
            >
              {getFileIcon(item)}
              <span className="truncate">{item.name}</span>
              {item.type === "directory" && (
                <div className="ml-auto flex opacity-0 group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentPath(item.path)
                      setIsCreatingFile(true)
                    }}
                  >
                    <Icons.fileAdd className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentPath(item.path)
                      setIsCreatingFolder(true)
                    }}
                  >
                    <Icons.folderAdd className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
              {item.type === "file" && (
                <div className="ml-auto flex opacity-0 group-hover:opacity-100">
                  <span className="text-xs text-emerald-500 mr-1">saved</span>
                </div>
              )}
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-48">
            {item.type === "directory" && (
              <>
                <ContextMenuItem
                  onClick={() => {
                    setCurrentPath(item.path)
                    setIsCreatingFile(true)
                  }}
                >
                  <Icons.fileAdd className="mr-2 h-4 w-4" />
                  New File
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => {
                    setCurrentPath(item.path)
                    setIsCreatingFolder(true)
                  }}
                >
                  <Icons.folderAdd className="mr-2 h-4 w-4" />
                  New Folder
                </ContextMenuItem>
                <ContextMenuSeparator />
              </>
            )}
            {item.type === "file" && (
              <>
                <ContextMenuItem
                  onClick={() => {
                    toast({
                      title: "Preview",
                      description: `Preview functionality for ${item.name}`,
                    })
                  }}
                >
                  <Icons.eye className="mr-2 h-4 w-4" />
                  Preview
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(item.content || "")
                    toast({
                      title: "Copied",
                      description: "File content copied to clipboard",
                    })
                  }}
                >
                  <Icons.copy className="mr-2 h-4 w-4" />
                  Copy Content
                </ContextMenuItem>
              </>
            )}
            <ContextMenuItem
              onClick={() => {
                setCurrentPath(item.path)
                setNewItemName(item.name)
                setIsRenaming(true)
              }}
            >
              <Icons.edit className="mr-2 h-4 w-4" />
              Rename
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => {
                onDeleteFile(item.path)
              }}
              className="text-red-500 focus:text-red-500"
            >
              <Icons.trash className="mr-2 h-4 w-4" />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        {item.type === "directory" && item.children && expandedFolders[item.path] && (
          <div>{renderFileTree(item.children, depth + 1)}</div>
        )}
      </div>
    ))
  }

  return (
    <div className="flex h-full flex-col bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-800 p-2">
        <h3 className="font-medium text-slate-200 text-sm uppercase tracking-wider">Explorer</h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400 hover:text-slate-200"
            onClick={() => {
              setCurrentPath("")
              setIsCreatingFile(true)
            }}
          >
            <Icons.fileAdd className="h-4 w-4" />
            <span className="sr-only">New File</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400 hover:text-slate-200"
            onClick={() => {
              setCurrentPath("")
              setIsCreatingFolder(true)
            }}
          >
            <Icons.folderAdd className="h-4 w-4" />
            <span className="sr-only">New Folder</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400 hover:text-slate-200"
            onClick={() => {
              setExpandedFolders({})
              if (onToggleFolder) {
                onToggleFolder({})
              }
            }}
          >
            <Icons.folderClosed className="h-4 w-4" />
            <span className="sr-only">Collapse All</span>
          </Button>
        </div>
      </div>
      <div className="flex-1 px-1 py-2 overflow-auto">
        <div className="space-y-1">{renderFileTree(files)}</div>
      </div>

      {/* Create File Dialog */}
      <Dialog open={isCreatingFile} onOpenChange={setIsCreatingFile}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex gap-2">
              <Input
                placeholder="filename"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                autoFocus
                className="flex-1"
              />
              <Select value={fileType} onValueChange={setFileType}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="js">JS</SelectItem>
                  <SelectItem value="jsx">JSX</SelectItem>
                  <SelectItem value="ts">TS</SelectItem>
                  <SelectItem value="tsx">TSX</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="md">MD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              {currentPath ? `File will be created in: ${currentPath}` : "File will be created in the root directory"}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingFile(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFile}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Folder Dialog */}
      <Dialog open={isCreatingFolder} onOpenChange={setIsCreatingFolder}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="folder-name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              autoFocus
            />
            <p className="text-sm text-muted-foreground">
              {currentPath
                ? `Folder will be created in: ${currentPath}`
                : "Folder will be created in the root directory"}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingFolder(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="new-name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenaming(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameFile}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { EditorHeader } from "./editor-header"
import { CodeEditor } from "./code-editor"
import { FileExplorer, type FileType } from "./file-explorer"
import { Terminal } from "./terminal"
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { AICommandCenter } from "./ai-command-center"
import { v4 as uuidv4 } from "uuid"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface EditorContainerProps {
  projectId: string
}

export function EditorContainer({ projectId }: EditorContainerProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [isTerminalOpen, setIsTerminalOpen] = useLocalStorage("isTerminalOpen", true)
  const [activeTab, setActiveTab] = useLocalStorage("activeTab", "explorer")
  const [editorTheme, setEditorTheme] = useLocalStorage("editorTheme", "dark")
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [terminalOutput, setTerminalOutput] = useState<string[]>([])
  const [initialized, setInitialized] = useState(false)
  const [isOpenFolderDialogOpen, setIsOpenFolderDialogOpen] = useState(false)
  const [folderPath, setFolderPath] = useState("")
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({})

  // Project data
  const project = {
    id: projectId,
    name: "AICODE Project",
  }

  // Initialize file system with hierarchical structure
  const [files, setFiles] = useState<FileType[]>([
    {
      id: uuidv4(),
      name: "src",
      type: "directory",
      path: "/src",
      children: [
        {
          id: uuidv4(),
          name: "components",
          type: "directory",
          path: "/src/components",
          children: [
            {
              id: uuidv4(),
              name: "Button.jsx",
              type: "file",
              path: "/src/components/Button.jsx",
              content:
                'import React from "react";\n\nconst Button = ({ children, onClick }) => {\n  return (\n    <button\n      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"\n      onClick={onClick}\n    >\n      {children}\n    </button>\n  );\n};\n\nexport default Button;',
            },
            {
              id: uuidv4(),
              name: "Card.jsx",
              type: "file",
              path: "/src/components/Card.jsx",
              content:
                'import React from "react";\n\nconst Card = ({ title, children }) => {\n  return (\n    <div className="border rounded-lg p-4 shadow-sm">\n      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}\n      {children}\n    </div>\n  );\n};\n\nexport default Card;',
            },
          ],
        },
        {
          id: uuidv4(),
          name: "utils",
          type: "directory",
          path: "/src/utils",
          children: [
            {
              id: uuidv4(),
              name: "helpers.js",
              type: "file",
              path: "/src/utils/helpers.js",
              content:
                '/**\n * Format a date to a readable string\n */\nexport function formatDate(date) {\n  return new Date(date).toLocaleDateString();\n}\n\n/**\n * Truncate a string to a specified length\n */\nexport function truncateString(str, num) {\n  if (str.length <= num) {\n    return str;\n  }\n  return str.slice(0, num) + "...";\n}',
            },
          ],
        },
        {
          id: uuidv4(),
          name: "App.jsx",
          type: "file",
          path: "/src/App.jsx",
          content:
            'import React from "react";\nimport Button from "./components/Button";\nimport Card from "./components/Card";\nimport { formatDate } from "./utils/helpers";\n\nfunction App() {\n  const today = formatDate(new Date());\n  \n  return (\n    <div className="container mx-auto p-4">\n      <h1 className="text-2xl font-bold mb-4">My React App</h1>\n      <p>Today is {today}</p>\n      \n      <Card title="Welcome">\n        <p className="mb-4">This is a sample React application.</p>\n        <Button onClick={() => alert("Button clicked!")}>Click Me</Button>\n      </Card>\n    </div>\n  );\n}\n\nexport default App;',
        },
        {
          id: uuidv4(),
          name: "index.js",
          type: "file",
          path: "/src/index.js",
          content:
            'import React from "react";\nimport ReactDOM from "react-dom";\nimport App from "./App";\nimport "./styles.css";\n\nReactDOM.render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>,\n  document.getElementById("root")\n);',
        },
        {
          id: uuidv4(),
          name: "styles.css",
          type: "file",
          path: "/src/styles.css",
          content:
            'body {\n  margin: 0;\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,\n    Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\ncode {\n  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",\n    monospace;\n}',
        },
      ],
    },
    {
      id: uuidv4(),
      name: "public",
      type: "directory",
      path: "/public",
      children: [
        {
          id: uuidv4(),
          name: "index.html",
          type: "file",
          path: "/public/index.html",
          content:
            '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1" />\n    <title>React App</title>\n  </head>\n  <body>\n    <div id="root"></div>\n  </body>\n</html>',
        },
      ],
    },
    {
      id: uuidv4(),
      name: "package.json",
      type: "file",
      path: "/package.json",
      content:
        '{\n  "name": "my-react-app",\n  "version": "0.1.0",\n  "private": true,\n  "dependencies": {\n    "react": "^17.0.2",\n    "react-dom": "^17.0.2",\n    "react-scripts": "5.0.0"\n  },\n  "scripts": {\n    "start": "react-scripts start",\n    "build": "react-scripts build",\n    "test": "react-scripts test",\n    "eject": "react-scripts eject"\n  },\n  "eslintConfig": {\n    "extends": [\n      "react-app",\n      "react-app/jest"\n    ]\n  },\n  "browserslist": {\n    "production": [\n      ">0.2%",\n      "not dead",\n      "not op_mini all"\n    ],\n    "development": [\n      "last 1 chrome version",\n      "last 1 firefox version",\n      "last 1 safari version"\n    ]\n  }\n}',
    },
    {
      id: uuidv4(),
      name: "README.md",
      type: "file",
      path: "/README.md",
      content:
        "# AICODE Project\n\nThis is a sample React application created for demonstration purposes.\n\n## Available Scripts\n\nIn the project directory, you can run:\n\n### `npm start`\n\nRuns the app in the development mode.\nOpen [http://localhost:3000](http://localhost:3000) to view it in the browser.\n\n### `npm test`\n\nLaunches the test runner in the interactive watch mode.\n\n### `npm run build`\n\nBuilds the app for production to the `build` folder.",
    },
  ])

  // Initialize with a default file
  useEffect(() => {
    if (!initialized && files.length > 0) {
      // Find the first file to select
      const firstFile = findFirstFile(files)
      if (firstFile) {
        setSelectedFile(firstFile.path)
      }
      setInitialized(true)
    }
  }, [files, initialized])

  // Helper function to find the first file in the hierarchy
  const findFirstFile = (items: FileType[]): FileType | null => {
    for (const item of items) {
      if (item.type === "file") {
        return item
      }
      if (item.type === "directory" && item.children && item.children.length > 0) {
        const found = findFirstFile(item.children)
        if (found) return found
      }
    }
    return null
  }

  // Find a file by path in the hierarchical structure
  const findFileByPath = (items: FileType[], filePath: string): FileType | null => {
    for (const item of items) {
      if (item.path === filePath) {
        return item
      }
      if (item.type === "directory" && item.children && item.children.length > 0) {
        const found = findFileByPath(item.children, filePath)
        if (found) return found
      }
    }
    return null
  }

  // Get the current file content
  const currentFile = selectedFile ? findFileByPath(files, selectedFile) : null

  // Update file content
  const updateFileContent = (content: string) => {
    if (!selectedFile) return

    setFiles((prevFiles) => {
      const updateContent = (items: FileType[]): FileType[] => {
        return items.map((item) => {
          if (item.path === selectedFile) {
            return { ...item, content }
          }
          if (item.type === "directory" && item.children) {
            return { ...item, children: updateContent(item.children) }
          }
          return item
        })
      }
      return updateContent(prevFiles)
    })
  }

  // Create a new file or directory
  const createFile = (name: string, type: "file" | "directory", parentPath: string) => {
    const newId = uuidv4()
    const newPath = parentPath ? `${parentPath}/${name}` : `/${name}`

    const newItem: FileType = {
      id: newId,
      name,
      type,
      path: newPath,
      content: type === "file" ? "" : undefined,
      children: type === "directory" ? [] : undefined,
    }

    setFiles((prevFiles) => {
      const addItem = (items: FileType[]): FileType[] => {
        // If adding to root
        if (!parentPath) {
          return [...items, newItem]
        }

        return items.map((item) => {
          if (item.path === parentPath && item.type === "directory") {
            return {
              ...item,
              children: [...(item.children || []), newItem],
            }
          }
          if (item.type === "directory" && item.children) {
            return { ...item, children: addItem(item.children) }
          }
          return item
        })
      }
      return addItem(prevFiles)
    })

    if (type === "file") {
      setSelectedFile(newPath)
    }

    toast({
      title: type === "file" ? "File created" : "Folder created",
      description: `${name} has been created successfully.`,
    })
  }

  // Delete a file or directory
  const deleteFile = (filePath: string) => {
    if (selectedFile === filePath) {
      setSelectedFile(null)
    }

    setFiles((prevFiles) => {
      const removeItem = (items: FileType[]): FileType[] => {
        // Handle root level items
        const filteredItems = items.filter((item) => item.path !== filePath)
        if (filteredItems.length < items.length) {
          return filteredItems
        }

        // Handle nested items
        return items.map((item) => {
          if (item.type === "directory" && item.children) {
            return { ...item, children: removeItem(item.children) }
          }
          return item
        })
      }
      return removeItem(prevFiles)
    })

    toast({
      title: "Item deleted",
      description: `The item has been deleted successfully.`,
    })
  }

  // Rename a file or directory
  const renameFile = (filePath: string, newName: string) => {
    setFiles((prevFiles) => {
      const rename = (items: FileType[]): FileType[] => {
        return items.map((item) => {
          if (item.path === filePath) {
            const pathParts = item.path.split("/")
            pathParts.pop() // Remove the last part (old name)
            const parentDir = pathParts.join("/") || "/"
            const newPath = parentDir === "/" ? `/${newName}` : `${parentDir}/${newName}`

            // Update selected file path if it's the one being renamed
            if (selectedFile === filePath) {
              setSelectedFile(newPath)
            }

            return {
              ...item,
              name: newName,
              path: newPath,
              children: item.children ? updateChildPaths(item.children, item.path, newPath) : undefined,
            }
          }
          if (item.type === "directory" && item.children) {
            return { ...item, children: rename(item.children) }
          }
          return item
        })
      }
      return rename(prevFiles)
    })

    toast({
      title: "Item renamed",
      description: `Item has been renamed to ${newName}.`,
    })
  }

  // Update paths of all children when a directory is renamed
  const updateChildPaths = (children: FileType[], oldParentPath: string, newParentPath: string): FileType[] => {
    return children.map((child) => {
      const relativePath = child.path.substring(oldParentPath.length)
      const newPath = newParentPath + relativePath

      return {
        ...child,
        path: newPath,
        children: child.children ? updateChildPaths(child.children, child.path, newPath) : undefined,
      }
    })
  }

  // Handle opening a folder
  const handleOpenFolder = () => {
    // In a real app, this would open a file dialog
    // For now, we'll simulate it with a dialog
    setIsOpenFolderDialogOpen(true)
  }

  // Simulate opening a folder
  const simulateOpenFolder = () => {
    if (!folderPath.trim()) {
      toast({
        title: "Error",
        description: "Please enter a folder path",
        variant: "destructive",
      })
      return
    }

    // Create a more realistic file structure based on the folder path
    const folderName = folderPath.split("/").pop() || "project"
    const newFiles: FileType[] = [
      {
        id: uuidv4(),
        name: folderName,
        type: "directory",
        path: `/${folderName}`,
        children: [
          {
            id: uuidv4(),
            name: "src",
            type: "directory",
            path: `/${folderName}/src`,
            children: [
              {
                id: uuidv4(),
                name: "index.js",
                type: "file",
                path: `/${folderName}/src/index.js`,
                content: '// Main entry point\nconsole.log("Hello from new project!");',
              },
              {
                id: uuidv4(),
                name: "styles.css",
                type: "file",
                path: `/${folderName}/src/styles.css`,
                content: "/* Main styles */\nbody {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 20px;\n}",
              },
            ],
          },
          {
            id: uuidv4(),
            name: "README.md",
            type: "file",
            path: `/${folderName}/README.md`,
            content: `# ${folderName}\n\nThis is a new project opened from ${folderPath}.`,
          },
          {
            id: uuidv4(),
            name: "package.json",
            type: "file",
            path: `/${folderName}/package.json`,
            content: `{\n  "name": "${folderName.toLowerCase()}",\n  "version": "1.0.0",\n  "description": "A new project",\n  "main": "src/index.js",\n  "scripts": {\n    "start": "node src/index.js"\n  }\n}`,
          },
        ],
      },
    ]

    // Set expanded folders for better UX
    const newExpandedFolders = {
      [`/${folderName}`]: true,
      [`/${folderName}/src`]: true,
    }

    setExpandedFolders(newExpandedFolders)
    setFiles(newFiles)
    setIsOpenFolderDialogOpen(false)
    setFolderPath("")

    // Select the README.md file by default
    setSelectedFile(`/${folderName}/README.md`)

    toast({
      title: "Folder opened",
      description: `Opened folder: ${folderPath}`,
    })
  }

  // Run code in the terminal
  const runCode = () => {
    if (!currentFile) return

    setTerminalOutput((prev) => [...prev, `> Running ${currentFile.name}...`])

    // Simulate code execution based on file type
    setTimeout(() => {
      const extension = currentFile.name.split(".").pop()?.toLowerCase()

      if (extension === "js" || extension === "jsx") {
        setTerminalOutput((prev) => [
          ...prev,
          "Starting JavaScript execution...",
          "Output:",
          "-------------------",
          "> Hello from JavaScript!",
          "> Script executed successfully.",
          "-------------------",
          "Finished in 0.25s",
        ])
      } else if (extension === "html") {
        setTerminalOutput((prev) => [...prev, "Opening HTML preview...", "HTML rendered in preview pane."])
      } else if (extension === "css") {
        setTerminalOutput((prev) => [...prev, "Parsing CSS...", "CSS validated successfully."])
      } else {
        setTerminalOutput((prev) => [
          ...prev,
          `Cannot execute file with extension: ${extension}`,
          "Please run a JavaScript, HTML, or CSS file.",
        ])
      }
    }, 1000)

    toast({
      title: "Code executed",
      description: `Running ${currentFile.name}`,
    })
  }

  // Save the current file
  const saveFile = () => {
    if (!currentFile) return

    toast({
      title: "File saved",
      description: `${currentFile.name} has been saved successfully.`,
    })
  }

  useEffect(() => {
    // Auto-save functionality
    const autoSaveInterval = setInterval(() => {
      if (currentFile && currentFile.content) {
        // Only show toast occasionally to avoid spamming
        const shouldNotify = Math.random() > 0.7
        if (shouldNotify) {
          toast({
            title: "Auto-saved",
            description: `${currentFile.name} has been automatically saved.`,
            variant: "default",
          })
        }
      }
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [currentFile])

  return (
    <div className="flex h-screen flex-col bg-slate-950">
      <EditorHeader
        projectName={project.name}
        fileName={currentFile?.name || ""}
        onSave={saveFile}
        onRun={runCode}
        onToggleAI={() => setIsAIOpen(!isAIOpen)}
        onToggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)}
      />
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="border-r border-slate-800">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid h-10 w-full grid-cols-2 bg-slate-900">
              <TabsTrigger value="explorer" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
                <Icons.files className="h-4 w-4 mr-2" />
                Explorer
              </TabsTrigger>
              <TabsTrigger value="search" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
                <Icons.search className="h-4 w-4 mr-2" />
                Search
              </TabsTrigger>
            </TabsList>
            <TabsContent value="explorer" className="h-[calc(100%-2.5rem)] p-0">
              <div className="flex flex-col h-full">
                <div className="p-2 border-b border-slate-800">
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleOpenFolder}>
                    <Icons.folderOpen className="mr-2 h-4 w-4" />
                    Open Folder
                  </Button>
                </div>
                <div className="flex-1">
                  <FileExplorer
                    files={files}
                    selectedFile={selectedFile}
                    onSelectFile={setSelectedFile}
                    onCreateFile={createFile}
                    onDeleteFile={deleteFile}
                    onRenameFile={renameFile}
                    expandedFolders={expandedFolders}
                    onToggleFolder={setExpandedFolders}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="search" className="h-[calc(100%-2.5rem)] p-0">
              <div className="flex flex-col h-full bg-slate-900">
                <div className="p-4 border-b border-slate-800">
                  <Input
                    placeholder="Search in files..."
                    className="bg-slate-800 text-slate-200 placeholder:text-slate-500"
                  />
                </div>
                <div className="flex-1 p-4 overflow-auto">
                  <div className="text-sm text-slate-400 text-center py-8">Type to search in files</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </ResizablePanel>

        <ResizablePanel defaultSize={80} className="flex flex-col">
          <div className="flex-1 overflow-hidden">
            {currentFile ? (
              <CodeEditor
                content={currentFile.content || ""}
                language={currentFile.name.split(".").pop() || ""}
                onChange={updateFileContent}
                theme={editorTheme}
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-slate-900 text-slate-400">
                <div className="text-center">
                  <Icons.file className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium">No file selected</h3>
                  <p className="mt-2 text-sm">Select a file from the explorer to start editing</p>
                </div>
              </div>
            )}
          </div>

          {isTerminalOpen && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={30} minSize={10} maxSize={50}>
                <Terminal output={terminalOutput} />
              </ResizablePanel>
            </>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>

      {isAIOpen && <AICommandCenter isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />}

      {/* Open Folder Dialog */}
      <Dialog open={isOpenFolderDialogOpen} onOpenChange={setIsOpenFolderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Open Folder</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="/path/to/your/project"
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
              autoFocus
            />
            <p className="text-sm text-muted-foreground">
              Enter the path to the folder you want to open. In a real application, this would be a file picker dialog.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpenFolderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={simulateOpenFolder}>Open</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

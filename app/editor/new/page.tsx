import { EditorContainer } from "@/components/editor/editor-container"

export default function NewEditorPage() {
  return (
    <div className="flex h-screen flex-col">
      <EditorContainer projectId="new" />
    </div>
  )
}

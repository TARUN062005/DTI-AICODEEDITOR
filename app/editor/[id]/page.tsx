import { EditorLayout } from "@/components/layout/editor-layout"
import { CodeEditor } from "@/components/editor/code-editor"

export default function EditorPage({ params }: { params: { id: string } }) {
  return (
    <EditorLayout>
      <CodeEditor projectId={params.id} />
    </EditorLayout>
  )
}
import { EditorContainer } from "@/components/editor/editor-container"

interface EditorPageProps {
  params: {
    id: string
  }
}

export default function EditorPage({ params }: EditorPageProps) {
  return (
    <div className="flex h-screen flex-col">
      <EditorContainer projectId={params.id} />
    </div>
  )
}

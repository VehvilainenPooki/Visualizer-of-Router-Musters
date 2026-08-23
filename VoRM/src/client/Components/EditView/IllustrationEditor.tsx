import { useRef, useState } from 'react'
import { Group } from '@mantine/core'
import type { PlainNetworkGraphData } from '../../../common/types/network'
import { EditNavbar } from './EditNavbar'
import type { VisibilityStatus } from './EditNavbar/Components/VisibilitySelector'
import Graph from '../Primitives/Graph'
import GraphCodeEditor from './GraphCodeEditor'
import SplitAdjuster from '../Primitives/SplitAdjuster'
import type { SaveTarget } from './EditNavbar/Components/SaveStatusButton'
import { useSaveHandler } from './useIllustrationSave'
import { useAuth } from '../../contexts/AuthContext'

interface IllustrationEditorProps {
  id: number | null
  initialData: PlainNetworkGraphData
  initialIsPublic?: boolean
  initialName?: string
  initialDescription?: string | null
  onCreated?: (id: number) => void
}

export function IllustrationEditor({ id, initialData, initialIsPublic, initialName, initialDescription, onCreated }: IllustrationEditorProps) {
  const { token } = useAuth()
  const [visibility, setVisibility] = useState<VisibilityStatus>(initialIsPublic ? 'public' : 'private')
  const [editorWidth, setEditorWidth] = useState<number>(30)
  const [name, setName] = useState(initialName ?? 'Untitled')
  const [description, setDescription] = useState(initialDescription ?? null)
  const splitContainerRef = useRef<HTMLDivElement>(null)
  const [saveTarget, setSaveTarget] = useState<SaveTarget>('none')
  const { statusOfSave, saveMetadata, saveVisibility, saveGraph } = useSaveHandler({id, token: token ?? '', name, description, public:visibility=="public", saveTarget, onCreated})

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <EditNavbar
        visibility={visibility}
        onVisibilityChange={setVisibility}
        name={name}
        description={description}
        onNameChange={setName}
        onDescriptionChange={setDescription}
        saveTarget={saveTarget}
        setSaveTarget={setSaveTarget}
        saveStatus={statusOfSave}
        saveMetadata={saveMetadata}
        saveVisibility={saveVisibility}
      />
      <Group ref={splitContainerRef} align="stretch" wrap="nowrap" gap={0} style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
        <GraphCodeEditor editorWidth={editorWidth} saveGraph={saveGraph} />
        <SplitAdjuster containerRef={splitContainerRef} width={editorWidth} onWidthChange={setEditorWidth} />
        <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
          <Graph data={initialData} />
        </div>
      </Group>
    </div>
  )
}

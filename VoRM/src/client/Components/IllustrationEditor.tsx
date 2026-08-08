import { useRef, useState } from 'react'
import { Group } from '@mantine/core'
import type { PlainNetworkGraphData } from '../../common/types/network'
import { EditNavbar, type visibilityStatus } from './Navbar/EditNavbar'
import Graph from './Graph'
import GraphCodeEditor from './GraphCodeEditor'
import SplitAdjuster from './SplitAdjuster'

interface IllustrationEditorProps {
  initialData: PlainNetworkGraphData
  initialName?: string
  initialDescription?: string | null
}

export function IllustrationEditor({ initialData, initialName, initialDescription }: IllustrationEditorProps) {
  const [visibility, setVisibility] = useState<visibilityStatus>('private')
  const [editorWidth, setEditorWidth] = useState<number>(30)
  const [name, setName] = useState(initialName ?? 'Untitled')
  const [description, setDescription] = useState(initialDescription ?? null)
  const splitContainerRef = useRef<HTMLDivElement>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <EditNavbar
        visibility={visibility}
        onVisibilityChange={setVisibility}
        name={name}
        description={description}
        onNameChange={setName}
        onDescriptionChange={setDescription}
      />
      <Group ref={splitContainerRef} align="stretch" wrap="nowrap" gap={0} style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
        <GraphCodeEditor editorWidth={editorWidth} />
        <SplitAdjuster containerRef={splitContainerRef} width={editorWidth} onWidthChange={setEditorWidth} />
        <Graph data={initialData} />
      </Group>
    </div>
  )
}

import { useRef, useState, useSyncExternalStore } from 'react'
import { Group } from '@mantine/core'
import type { PlainNetworkGraphData } from '../../../common/types/network'
import { EditNavbar } from './Navbar/EditNavbar'
import type { VisibilityStatus } from './Navbar/Components/VisibilitySelector'
import Graph from './Graph'
import GraphCodeEditor from './GraphCodeEditor'
import SplitAdjuster from '../Primitives/SplitAdjuster'
import * as ForceGraph from '../../ForceGraph'
import type { SaveTarget } from './Navbar/Components/SaveStatusButton'
import { useSaveHandler } from './useIllustrationSave'

interface IllustrationEditorProps {
  initialData: PlainNetworkGraphData
  initialName?: string
  initialDescription?: string | null
}

export function IllustrationEditor({ initialData, initialName, initialDescription }: IllustrationEditorProps) {
  const [visibility, setVisibility] = useState<VisibilityStatus>('private')
  const [editorWidth, setEditorWidth] = useState<number>(30)
  const [name, setName] = useState(initialName ?? 'Untitled')
  const [description, setDescription] = useState(initialDescription ?? null)
  const splitContainerRef = useRef<HTMLDivElement>(null)
  const [saveTarget, setSaveTarget] = useState<SaveTarget>('none')
  const data = useSyncExternalStore(ForceGraph.subscribeToData, ForceGraph.getData)
  const { statusOfSave, saveMetadata, saveVisibility, saveGraph } = useSaveHandler({name, description, public:visibility=="public", graphData: data, saveTarget})

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

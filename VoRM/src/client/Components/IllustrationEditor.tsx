import { useState } from 'react'
import { Group } from '@mantine/core'
import type { PlainNetworkGraphData } from '../../common/types/network'
import { EditNavbar, type EditTool } from './Navbar/EditNavbar'
import Graph from './Graph'
import GraphCodeEditor from './GraphCodeEditor'

interface IllustrationEditorProps {
  initialData: PlainNetworkGraphData
}

export function IllustrationEditor({ initialData }: IllustrationEditorProps) {
  const [tool, setTool] = useState<EditTool>('node')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <EditNavbar tool={tool} onToolChange={setTool} />
      <Group align="stretch" wrap="nowrap" gap={0} style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
        <GraphCodeEditor />
        <Graph data={initialData} />
      </Group>
    </div>
  )
}

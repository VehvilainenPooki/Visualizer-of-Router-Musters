import { useState } from 'react'
import { Group } from '@mantine/core'
import type { PlainNetworkGraphData } from '../../common/types/network'
import { EditNavbar, type EditTool } from './Navbar/EditNavbar'
import Graph from './Graph'
import GraphCodePanel from './GraphCodePanel'

interface IllustrationEditorProps {
  initialData: PlainNetworkGraphData
}

export function IllustrationEditor({ initialData }: IllustrationEditorProps) {
  const [tool, setTool] = useState<EditTool>('node')

  return (
    <div>
      <EditNavbar tool={tool} onToolChange={setTool} />
      <Group align="flex-start" wrap="nowrap" gap={0}>
        <Graph data={initialData} />
        <GraphCodePanel />
      </Group>
    </div>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { Paper } from '@mantine/core'
import * as ForceGraph from '../ForceGraph'
import CodeMirror from '@uiw/react-codemirror';




export default function GraphCodeEditor({ editorWidth }: { editorWidth: number }) {
  useEffect(() => {
    setValue(JSON.stringify(ForceGraph.getData(), null, 2))
    ForceGraph.subscribe(() => {
        setValue(JSON.stringify(ForceGraph.getData(), null, 2))
    })
  }, [])

  const [value, setValue] = useState("console.log('hello world!');");
  const onChange = useCallback((val:any, _viewUpdate:any) => {
    console.log('val:', val);
    setValue(val);
  }, []);
  return (
    <Paper style={{boxShadow:'var(--shadow-even-xs)', width: `${editorWidth}%`, height: '100%', minWidth: 0, minHeight: 0, overflow: 'hidden'}}>
      <CodeMirror value={value} height='100%' style={{ height: '100%', overflow: 'auto' }} onChange={onChange} />
    </Paper>
  )
}

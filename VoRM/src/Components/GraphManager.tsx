import { useState } from 'react'

import type { FC, SubmitEvent } from 'react'

import * as ForceGraph from '../ForceGraph'

const Sidebar: FC = () => {
  const [nodeName, setNodeName] = useState('')
  const [source, setSource] = useState('')
  const [target, setTarget] = useState('')

  const handleAddNode = ( event: SubmitEvent ) => {
    event.preventDefault()
    if (nodeName.trim()) {
      ForceGraph.addNode(nodeName.trim())
      setNodeName('')
    }
  }

  const handleAddLink = ( event: SubmitEvent ) => {
    event.preventDefault()
    if (source.trim() && target.trim()) {
      ForceGraph.addLink(source.trim(), target.trim())
      setSource('')
      setTarget('')
    }
  }

  return (
    <div className="sidebar">
      <h2>Graph Controls</h2>

      <div className="section">
        <h3>Add Node</h3>
        <form onSubmit={handleAddNode} >
          <input
            type="text"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            placeholder="Node name"
          />
          <br/>
          <button type='submit'>Add Node</button>
        </form>
      </div>

      <div className="section">
        <h3>Add Link</h3>
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Source node"
        />
        <br/>
        <form onSubmit={handleAddLink}>
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Target node"
          />
          <br/>
          <button type='submit'>Add Link</button>
        </form>
      </div>
    </div>
  )
}

export default Sidebar

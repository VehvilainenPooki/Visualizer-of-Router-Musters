import type {FC} from 'react'

import Graph from './Components/Graph'
import GraphManager from './Components/GraphManager'

const App: FC = () => {
  return (
    <div>
      <h1 style={{ fontSize: '48px' }}>
        <img src="/vorm.svg" alt="" style={{ height: '1.2em', verticalAlign: 'top', marginRight: '10px' }} />
        Visualizer of Router Musters
      </h1>
      <GraphManager />
      <Graph />
    </div>
  )
}

export default App

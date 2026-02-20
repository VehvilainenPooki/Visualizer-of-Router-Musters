import type {FC} from 'react'

import Graph from './Components/Graph'
import Sidebar from './Components/GraphManager'

const App: FC = () => {
  return (
    <div>
      <h1>Force Graph Visualization</h1>
      <Sidebar />
      <Graph />
    </div>
  )
}

export default App

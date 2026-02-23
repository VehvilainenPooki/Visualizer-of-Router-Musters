import type {FC} from 'react'

import Graph from './Components/Graph'
import Sidebar from './Components/GraphManager'
import vorm from '../../public/vorm.svg'

const App: FC = () => {
  return (
    <div>
      
      <h1 style={{ fontSize: '48px' }}>
        <img src={vorm} alt="" style={{ height: '1.2em', verticalAlign: 'top', marginRight: '10px' }} />
        Visualizer of Router Musters
      </h1>
      <Sidebar />
      <Graph />
    </div>
  )
}

export default App

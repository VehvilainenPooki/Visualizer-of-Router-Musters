import type { PlainNetworkGraphData } from './network'

export interface Illustration {
  id: number
  userId: number
  name: string
  description: string | null
  graphcode: PlainNetworkGraphData
  public: boolean
}

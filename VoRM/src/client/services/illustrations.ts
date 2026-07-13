import type { Result } from '../../common/types/result'

const baseUrl = '/api/illustrations'

export interface Illustration {
  id: number
  userId: number
}

export interface NodeType {
  id: number
  name: string
}

export interface LinkType {
  id: number
  name: string
}

export interface IllustrationNode {
  id: number
  illustrationId: number
  nodeTypeId: number
  name: string | null
  isStatic: boolean
  x: number | null
  y: number | null
  nodeType: NodeType
}

export interface IllustrationLink {
  id: number
  illustrationId: number
  linkTypeId: number
  sourceNodeId: number
  targetNodeId: number
  linkType: LinkType
  sourceNode: IllustrationNode
  targetNode: IllustrationNode
}

export interface IllustrationDetail extends Illustration {
  nodes: IllustrationNode[]
  links: IllustrationLink[]
}

const authHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
})

export const getIllustrations = async (token: string): Promise<Result<Illustration[]>> => {
  try {
    const response = await fetch(baseUrl, { headers: authHeaders(token) })
    if (!response.ok) return { ok: false, error: 'Failed to fetch illustrations', status: response.status }
    return { ok: true, data: await response.json(), status: response.status }
  } catch {
    return { ok: false, error: 'Network error', status: 0 }
  }
}

export const getIllustration = async (token: string, id: number): Promise<Result<IllustrationDetail>> => {
  try {
    const response = await fetch(`${baseUrl}/${id}`, { headers: authHeaders(token) })
    if (!response.ok) return { ok: false, error: 'Failed to fetch illustration', status: response.status }
    return { ok: true, data: await response.json(), status: response.status }
  } catch {
    return { ok: false, error: 'Network error', status: 0 }
  }
}

export const createIllustration = async (token: string): Promise<Result<Illustration>> => {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: authHeaders(token)
    })
    if (!response.ok) {
      const data = await response.json()
      return { ok: false, error: data.error ?? 'Failed to create illustration', status: response.status }
    }
    return { ok: true, data: await response.json(), status: response.status }
  } catch {
    return { ok: false, error: 'Network error', status: 0 }
  }
}

export const deleteIllustration = async (token: string, id: number): Promise<Result<void>> => {
  try {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token)
    })
    if (!response.ok) return { ok: false, error: 'Failed to delete illustration', status: response.status }
    return { ok: true, data: undefined, status: response.status }
  } catch {
    return { ok: false, error: 'Network error', status: 0 }
  }
}

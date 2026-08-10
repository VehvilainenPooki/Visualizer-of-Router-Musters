import type { Result } from '../../common/types/result'
import type { Illustration } from '../../common/types/illustration'

const baseUrl = '/api/illustrations'

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

export const getPublicIllustrations = async (): Promise<Result<Illustration[]>> => {
  try {
    const response = await fetch(`${baseUrl}/public`)
    if (!response.ok) return { ok: false, error: 'Failed to fetch illustrations', status: response.status }
    return { ok: true, data: await response.json(), status: response.status }
  } catch {
    return { ok: false, error: 'Network error', status: 0 }
  }
}

export const getIllustration = async (token: string | null, id: number): Promise<Result<Illustration>> => {
  try {
    const response = await fetch(`${baseUrl}/${id}`, { headers: token ? authHeaders(token) : undefined })
    if (!response.ok) return { ok: false, error: 'Failed to fetch illustration', status: response.status }
    return { ok: true, data: await response.json(), status: response.status }
  } catch {
    return { ok: false, error: 'Network error', status: 0 }
  }
}

export const createIllustration = async (token: string, jsonCode: Illustration): Promise<Result<Illustration>> => {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(jsonCode) 
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

export const updateIllustration = async (token: string, jsonCode: Illustration): Promise<Result<Illustration>> => {
  try {
    const response = await fetch(`${baseUrl}/${jsonCode.id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(jsonCode) 
    })
    if (!response.ok) {
      const data = await response.json()
      return { ok: false, error: data.error ?? 'Failed to update illustration', status: response.status }
    }
    return { ok: true, data: await response.json(), status: response.status }
  } catch {
    return { ok: false, error: 'Network error', status: 0 }
  }
}

export const updateIllustrationMetadata = async (
  token: string,
  id: number,
  metadata: Pick<Illustration, 'name' | 'description'>
): Promise<Result<Illustration>> => {
  try {
    const response = await fetch(`${baseUrl}/${id}/metadata`, {
      method: 'PATCH',
      headers: authHeaders(token),
      body: JSON.stringify(metadata)
    })
    if (!response.ok) {
      const data = await response.json()
      return { ok: false, error: data.error ?? 'Failed to update illustration metadata', status: response.status }
    }
    return { ok: true, data: await response.json(), status: response.status }
  } catch {
    return { ok: false, error: 'Network error', status: 0 }
  }
}

export const updateIllustrationGraphcode = async (
  token: string,
  id: number,
  graphcode: Illustration['graphcode']
): Promise<Result<Illustration>> => {
  try {
    const response = await fetch(`${baseUrl}/${id}/graphcode`, {
      method: 'PATCH',
      headers: authHeaders(token),
      body: JSON.stringify({ graphcode })
    })
    if (!response.ok) {
      const data = await response.json()
      return { ok: false, error: data.error ?? 'Failed to update illustration graphcode', status: response.status }
    }
    return { ok: true, data: await response.json(), status: response.status }
  } catch {
    return { ok: false, error: 'Network error', status: 0 }
  }
}

export const toggleIllustrationVisibility = async (token: string, id: number): Promise<Result<Illustration>> => {
  try {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      headers: authHeaders(token)
    })
    if (!response.ok) {
      const data = await response.json()
      return { ok: false, error: data.error ?? 'Failed to update illustration visibility', status: response.status }
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

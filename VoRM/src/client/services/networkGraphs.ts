import type { Result } from '../../common/types/result'

const baseUrl = '/api/networkGraphs'

export const testEcho = async (echo: string): Promise<Result<{ message: string }>> => {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: echo })
    })
    if (!response.ok) {
      return { ok: false, error: 'Failed to echo', status: response.status }
    }
    return { ok: true, data: await response.json(), status: response.status }
  } catch {
    return { ok: false, error: 'Network error', status: 0 }
  }
}

const baseUrl = '/api/illustrations'

export interface Illustration {
  id: number
  userId: number
}

const authHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
})

export const getIllustrations = async (token: string): Promise<Illustration[]> => {
  const response = await fetch(baseUrl, { headers: authHeaders(token) })
  if (!response.ok) throw new Error('Failed to fetch illustrations')
  return response.json()
}

export const createIllustration = async (token: string): Promise<Illustration> => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: authHeaders(token)
  })
  if (!response.ok) throw new Error('Failed to create illustration')
  return response.json()
}

export const deleteIllustration = async (token: string, id: number): Promise<void> => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token)
  })
  if (!response.ok) throw new Error('Failed to delete illustration')
}

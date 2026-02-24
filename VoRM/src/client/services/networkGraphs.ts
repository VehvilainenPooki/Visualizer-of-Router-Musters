const baseUrl = '/api/networkGraphs'

export const testEcho = async (echo: string) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({content: echo})
  })

  if (!response.ok) {
    throw new Error('Failed to echo')
  }

  const data = await response.json()
  return data
}


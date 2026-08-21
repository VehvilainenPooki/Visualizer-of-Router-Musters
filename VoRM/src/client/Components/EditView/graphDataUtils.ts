import type { PlainNetworkGraphData } from '../../../common/types/network'

export const parseGraphData = (value: string): PlainNetworkGraphData | null => {
  try {
    const parsed = JSON.parse(value)
    if (parsed && Array.isArray(parsed.nodes) && Array.isArray(parsed.links)) return parsed
  } catch {
    // not valid JSON yet, leave as-is
  }
  return null
}

export const nextUniqueId = (prefix: string, taken: Set<string>) => {
  let i = taken.size + 1
  while (taken.has(`${prefix}-${i}`)) i++
  return `${prefix}-${i}`
}

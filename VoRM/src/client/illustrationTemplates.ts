export type TemplateId = 'blank' | 'basic' | 'complex'

interface TemplateGraphData {
  nodes: { id: string }[]
  links: { source: string, target: string }[]
}

export const illustrationTemplates: Record<TemplateId, TemplateGraphData> = {
  blank: {
    nodes: [],
    links: []
  },
  basic: {
    nodes: [
      { id: 'Router' },
      { id: 'Desktop' }
    ],
    links: [
      { source: 'Router', target: 'Desktop' }
    ]
  },
  complex: {
    nodes: [
      { id: 'Router' },
      { id: 'Desktop 1' },
      { id: 'Desktop 2' },
      { id: 'Laptop' },
      { id: 'Access Point' }
    ],
    links: [
      { source: 'Router', target: 'Desktop 1' },
      { source: 'Router', target: 'Desktop 2' },
      { source: 'Router', target: 'Access Point' },
      { source: 'Access Point', target: 'Laptop' }
    ]
  }
}

export const TEMPLATE_OPTIONS: { id: TemplateId, label: string, description: string }[] = [
  { id: 'blank', label: 'Blank', description: 'Start from an empty canvas' },
  { id: 'basic', label: 'Basic', description: 'A router connected to a desktop' },
  { id: 'complex', label: 'Complex', description: 'A small network with multiple devices' }
]

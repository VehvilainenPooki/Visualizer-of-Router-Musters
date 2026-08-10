import type { PlainNetworkGraphData } from '../common/types/network'

export type TemplateId = 'blank' | 'basic' | 'complex'

export const illustrationTemplates: Record<TemplateId, PlainNetworkGraphData> = {
  blank: {
    nodes: [],
    links: []
  },
  basic: {
    nodes: [
      { id: 'router', label: 'Router' },
      { id: 'desktop', label: 'Desktop' }
    ],
    links: [
      { id: 'router-desktop-lan', label: 'LAN', source: 'router', target: 'desktop' }
    ]
  },
  complex: {
    nodes: [
      { id: 'router', label: 'Router' },
      { id: 'desktop-1', label: 'Desktop 1' },
      { id: 'desktop-2', label: 'Desktop 2' },
      { id: 'laptop', label: 'Laptop' },
      { id: 'access-point', label: 'Access Point' }
    ],
    links: [
      { id: 'router-desktop-1-lan', label: 'LAN', source: 'router', target: 'desktop-1' },
      { id: 'router-desktop-2-lan', label: 'LAN', source: 'router', target: 'desktop-2' },
      { id: 'router-access-point-lan', label: 'LAN', source: 'router', target: 'access-point' },
      { id: 'access-point-laptop-wifi5', label: '5GHz Wi-Fi', source: 'access-point', target: 'laptop' }
    ]
  }
}

export const TEMPLATE_OPTIONS: { id: TemplateId, label: string, description: string }[] = [
  { id: 'blank', label: 'Blank', description: 'Start from an empty canvas' },
  { id: 'basic', label: 'Basic', description: 'A router connected to a desktop' },
  { id: 'complex', label: 'Complex', description: 'A small network with multiple devices' }
]

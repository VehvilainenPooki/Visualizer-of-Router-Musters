import type { PlainNetworkGraphData } from '../common/types/network'

export type TemplateId = 'blank' | 'basic' | 'complex'

export const illustrationTemplates: Record<TemplateId, PlainNetworkGraphData> = {
  blank: {
    nodes: [],
    links: []
  },
  basic: {
    nodes: [
      { id: 'router', name: 'Router' },
      { id: 'desktop', name: 'Desktop' }
    ],
    links: [
      { id: 'router-desktop-lan', name: 'LAN', source: 'router', target: 'desktop' }
    ]
  },
  complex: {
    nodes: [
      { id: 'router', name: 'Router' },
      { id: 'desktop-1', name: 'Desktop 1' },
      { id: 'desktop-2', name: 'Desktop 2' },
      { id: 'laptop', name: 'Laptop' },
      { id: 'access-point', name: 'Access Point' }
    ],
    links: [
      { id: 'router-desktop-1-lan', name: 'LAN', source: 'router', target: 'desktop-1' },
      { id: 'router-desktop-2-lan', name: 'LAN', source: 'router', target: 'desktop-2' },
      { id: 'router-access-point-lan', name: 'LAN', source: 'router', target: 'access-point' },
      { id: 'access-point-laptop-wifi5', name: '5GHz Wi-Fi', source: 'access-point', target: 'laptop' }
    ]
  }
}

export const TEMPLATE_OPTIONS: { id: TemplateId, label: string, description: string }[] = [
  { id: 'blank', label: 'Blank', description: 'Start from an empty canvas' },
  { id: 'basic', label: 'Basic', description: 'A router connected to a desktop' },
  { id: 'complex', label: 'Complex', description: 'A small network with multiple devices' }
]

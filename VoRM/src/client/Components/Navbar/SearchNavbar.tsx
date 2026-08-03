import type { ReactNode } from 'react'
import { Group, TextInput } from '@mantine/core'
import { Search } from 'lucide-react'
import { AppNavbar } from './AppNavbar'

interface SearchNavbarProps {
  value: string
  onChange: (value: string) => void
  leftSection?: ReactNode
}

export function SearchNavbar({ value, onChange, leftSection }: SearchNavbarProps) {
  return (
    <AppNavbar>
      <Group wrap="nowrap" gap="xs">
        {leftSection}
        <TextInput
          style={{ flex: 1 }}
          leftSection={<Search size={16} />}
          placeholder="Search illustrations"
          value={value}
          onChange={e => onChange(e.currentTarget.value)}
        />
      </Group>
    </AppNavbar>
  )
}

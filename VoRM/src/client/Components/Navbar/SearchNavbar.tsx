import { TextInput } from '@mantine/core'
import { Search } from 'lucide-react'
import { AppNavbar } from './AppNavbar'

interface SearchNavbarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchNavbar({ value, onChange }: SearchNavbarProps) {
  return (
    <AppNavbar>
      <TextInput
        leftSection={<Search size={16} />}
        placeholder="Search illustrations"
        value={value}
        onChange={e => onChange(e.currentTarget.value)}
      />
    </AppNavbar>
  )
}

import { createFileRoute, Link } from '@tanstack/react-router'
import { Text } from '@mantine/core'
import { TitleNavbar } from '../../../Components/Primitives/Navbar/TitleNavbar'
import { TEMPLATE_OPTIONS } from '../../../illustrationTemplates'

export const Route = createFileRoute('/illustrations/new/')({
  component: NewIllustrationPicker
})

function NewIllustrationPicker() {
  return (
    <div>
      <TitleNavbar title="Choose a starting point" />
      <div style={{ display: 'flex', flexDirection: 'row', gap: 'var(--mantine-spacing-md)', flexWrap: 'wrap', justifyContent: 'center', padding: 'var(--mantine-spacing-xl)' }}>
        {TEMPLATE_OPTIONS.map(option => (
          <Link
            key={option.id}
            to="/illustrations/new/edit"
            search={{ template: option.id }}
            style={cardStyle}
          >
            <Text ta="center" fw={500}>{option.label}</Text>
            <Text ta="center" size="sm" c="dimmed" mt="xs">{option.description}</Text>
          </Link>
        ))}
      </div>
    </div>
  )
}

const cardStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  width: '220px',
  border: '1px solid var(--mantine-color-gray-4)',
  borderRadius: 'var(--mantine-radius-md)',
  padding: 'var(--mantine-spacing-xl)',
  textDecoration: 'none',
  color: 'inherit'
}

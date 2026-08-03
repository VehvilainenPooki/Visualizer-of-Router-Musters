import { createFileRoute, Link } from '@tanstack/react-router'
import { Text, UnstyledButton } from '@mantine/core'
import { useElementSize } from '@mantine/hooks'
import { BookOpenText, Share2 } from 'lucide-react'
import { TitleNavbar } from '../Components/Navbar/TitleNavbar'

export const Route = createFileRoute('/')({
  component: MainView
})

function MainView() {
  const { ref: buttonsRef, width: buttonsW, height: buttonsH } = useElementSize()

  const availW = buttonsW * 0.8
  const availH = buttonsH * 0.8
  const gap = 0.02 * Math.min(buttonsW, buttonsH)
  const size = Math.max(0, Math.min(availH, (availW - gap) / 2))

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TitleNavbar title="Visualizer of Router Musters" />

      <div style={aboutBoxStyle}>
        <Text ta="center">
          This project aims to create an approachable and very visual way to show routing protocols in action. The goal is to have RIP, OSPF and i/eBGP protocols available with packet drop rates and other options easily changeable. This is aimed for educational purposes and won't be implementing every possible protocol detail.
        </Text>
      </div>

      <div
        ref={buttonsRef}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap
        }}
      >
        <UnstyledButton component={Link} to="/illustrations" style={{ ...actionCardStyle, width: size, height: size }}>
          <div style={iconWrapperStyle}>
            <BookOpenText size="100%" />
          </div>
          <Text ta="center" fw={500} mt="md" style={{ fontSize: size * 0.06 }}>Explore networks and simulations</Text>
        </UnstyledButton>
        <UnstyledButton component={Link} to="/illustrations/new" style={{ ...actionCardStyle, width: size, height: size }}>
          <div style={iconWrapperStyle}>
            <Share2 size="100%" />
          </div>
          <Text ta="center" fw={500} mt="md" style={{ fontSize: size * 0.06 }}>Create your own network visualization</Text>
        </UnstyledButton>
      </div>
    </div>
  )
}

const aboutBoxStyle = {
  maxWidth: '600px',
  margin: 'var(--mantine-spacing-md) auto 0',
  padding: 'var(--mantine-spacing-md)',
  border: '1px solid var(--mantine-color-gray-4)',
  borderRadius: 'var(--mantine-radius-md)'
}

const actionCardStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid var(--mantine-color-gray-4)',
  borderRadius: 'var(--mantine-radius-md)',
  padding: 'var(--mantine-spacing-xl)'
}

const iconWrapperStyle = {
  height: '50%',
  aspectRatio: '1 / 1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

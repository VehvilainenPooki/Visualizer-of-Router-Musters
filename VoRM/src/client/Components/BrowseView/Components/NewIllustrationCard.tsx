import { Card, Group, Title } from "@mantine/core"
import { Link } from "@tanstack/react-router"
import { Share2 } from "lucide-react"
import { Plus } from "lucide-react"

export function NewIllustrationCard() {
  return (
    <Link
      to="/illustrations/new"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Card
        withBorder
        shadow="sm"
        padding="lg"
        style={{ background: 'linear-gradient(90deg, var(--mantine-color-blue-2), var(--mantine-color-blue-6))' }}
      >
        <Group justify="space-between" wrap="nowrap">
          <Title order={4}>Create Illustration</Title>
          <Share2/>
          <Plus/>
        </Group>
      </Card>
    </Link>
  )
}
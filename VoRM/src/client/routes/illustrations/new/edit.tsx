import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { EditNavbar, type EditTool } from '../../../Components/Navbar/EditNavbar'
import { illustrationTemplates, type TemplateId } from '../../../illustrationTemplates'

export const Route = createFileRoute('/illustrations/new/edit')({
  validateSearch: (search: Record<string, unknown>) => ({
    template: (search.template as TemplateId) in illustrationTemplates ? search.template as TemplateId : 'blank'
  }),
  component: NewIllustrationEdit
})

function NewIllustrationEdit() {
  const [tool, setTool] = useState<EditTool>('node')
  const { template } = Route.useSearch()
  const graphData = illustrationTemplates[template]

  return (
    <div>
      <EditNavbar tool={tool} onToolChange={setTool} />
      <pre>{JSON.stringify(graphData, null, 2)}</pre>
    </div>
  )
}

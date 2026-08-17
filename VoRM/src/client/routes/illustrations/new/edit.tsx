import { createFileRoute } from '@tanstack/react-router'
import { IllustrationEditor } from '../../../Components/EditView/IllustrationEditor'
import { illustrationTemplates, type TemplateId } from '../../../illustrationTemplates'

export const Route = createFileRoute('/illustrations/new/edit')({
  validateSearch: (search: Record<string, unknown>) => ({
    template: (search.template as TemplateId) in illustrationTemplates ? search.template as TemplateId : 'blank'
  }),
  component: NewIllustrationEdit
})

function NewIllustrationEdit() {
  const { template } = Route.useSearch()
  const graphData = illustrationTemplates[template]

  return <IllustrationEditor initialData={graphData} />
}

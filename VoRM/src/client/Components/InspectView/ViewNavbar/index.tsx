import { Button, Title, Box } from '@mantine/core'
import { AppNavbar } from '../../Primitives/Navbar/AppNavbar'
import { useDisclosure } from '@mantine/hooks'
import { DescriptionModal } from './Components/DescriptionModal'
import { useAuth } from '../../../contexts/AuthContext'
import { useNavigate } from '@tanstack/react-router'
import { Illustration } from '../../../../common/types/illustration'

export function ViewNavbar( {illustration} : {illustration: Illustration} ) {
  const {userId} = useAuth()
  const navigate = useNavigate()

  const [descriptionModalOpened, { open: openDescriptionModal, close: closeDescriptionModal }] = useDisclosure(false)
  return (
    <Box style={{ position: 'relative', zIndex: 100, isolation: 'isolate' }}>
      <AppNavbar>
        <Title>{illustration.name}</Title>
        <Button variant='outline' radius='xl' size='compact-md' onClick={openDescriptionModal}>i</Button>
        { userId == illustration.userId ? 
          <Button onClick={
            () => navigate({
              to: '/illustrations/$illustrationId/edit',
              params: {illustrationId: String(illustration.id)}
          })}>
            Edit
          </Button> : '' 
        }
      </AppNavbar>
      <DescriptionModal
        opened={descriptionModalOpened}
        onClose={closeDescriptionModal}
        description={illustration.description?? 'This illustration doesn\'t have a description.'}
      />
    </ Box >
  )
}

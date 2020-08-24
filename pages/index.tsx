import { AppDrawer } from '../components/AppDrawer'
import { useAuth } from '../utils/useAuth'
import { Stack } from '@chakra-ui/core'
import Layout from '../components/Layout'
import { CurrentWorkout } from '../components/CurrentWorkout'
import { useStore } from '../utils/store'

function IndexPage() {
  const { user } = useAuth((state) => state)
  const { units } = useStore((store) => store)

  if (!user || !units) return null

  return (
    <Layout>
      <Stack shouldWrapChildren maxW="sm" width="full" mx="auto" minH="100vh" p="4">
        <AppDrawer />
        <CurrentWorkout />
      </Stack>
    </Layout>
  )
}

export default IndexPage

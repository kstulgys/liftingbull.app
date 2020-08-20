import { AppDrawer } from '../components/AppDrawer'
import { useAuth } from '../utils/useAuth'
import { Stack } from '@chakra-ui/core'
import { AddExercise } from '../components/AddExercise'
import { ExerciseList } from '../components/ExerciseList'
import Layout from '../components/Layout'

export default function IndexPage() {
  const { user } = useAuth((state) => state)
  if (!user) return null

  return (
    <Layout>
      <Stack shouldWrapChildren maxW="sm" width="full" mx="auto" minH="100vh" p="4">
        <AppDrawer />
        <ExerciseList />
        <AddExercise />
      </Stack>
    </Layout>
  )
}

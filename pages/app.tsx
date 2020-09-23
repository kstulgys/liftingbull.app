import React from 'react'
import { useRouter } from 'next/router'
import { AppDrawer } from '../components/AppDrawer'
import { useAuth } from '../utils/useAuth'
import { Stack, Text, Button } from '@chakra-ui/core'
import Layout from '../components/Layout'
import { CurrentWorkout } from '../components/CurrentWorkout'
import { useStore } from '../utils/store'
import { useDocument } from '@nandorojo/swr-firestore'
import { useSettings } from '../utils/useSettings'

function AppPage() {
  const router = useRouter()
  const { user, loading } = useAuth((store) => store)
  const { signout } = useAuth((store) => store.actions)

  React.useEffect(() => {
    if (!user?.uid) router.push('/signin')
  }, [user])

  if (!user?.uid) return null

  return (
    <Layout>
      <Stack shouldWrapChildren maxW="sm" width="full" mx="auto" minH="100vh" p="4">
        <Text fontSize="2xl" color="white">
          This is The App
        </Text>
        <Button onClick={signout}>Signout</Button>
        {/* <AppDrawer /> */}
        {/* <CurrentWorkout /> */}
      </Stack>
    </Layout>
  )
}

export default AppPage

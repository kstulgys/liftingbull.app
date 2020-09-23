import React from 'react'
import { useRouter } from 'next/router'
import { Box, Button, Stack, Select, Text } from '@chakra-ui/core'
import { useAuth } from '../utils/useAuth'

function SigninPage() {
  const router = useRouter()
  const { user, loading } = useAuth((store) => store)
  const { signInWithGoogle, listenForAuthStateChange } = useAuth((store) => store.actions)

  React.useEffect(() => {
    listenForAuthStateChange({ onSuccess: () => router.push('/app'), onFailure: () => router.push('/signin') })
  }, [])

  if (loading) return <Text>Loading...</Text>
  if (user?.uid) return null

  return (
    <Stack>
      <Button onClick={signInWithGoogle}>Sign in with Google</Button>
    </Stack>
  )
}

export default SigninPage

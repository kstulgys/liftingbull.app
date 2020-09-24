import React from 'react'
import { useRouter } from 'next/router'
import { Box, Button, Stack, Select, Text, Spinner } from '@chakra-ui/core'
import { useAuth } from '../utils/useAuth'
import Layout from '../components/Layout'

function SigninPage() {
  const router = useRouter()
  const { user, loading } = useAuth((store) => store)
  const { signInWithGoogle, listenForAuthStateChange } = useAuth((store) => store.actions)

  React.useEffect(() => {
    listenForAuthStateChange({ onSuccess: () => router.push('/app'), onFailure: () => router.push('/signin') })
  }, [])

  if (loading) {
    return (
      <Layout>
        <Stack pt="20">
          <Spinner size="xl" mx="auto" color="white" />
        </Stack>
      </Layout>
    )
  }

  if (user?.uid) return null

  return (
    <Layout>
      <Stack>
        <Button onClick={signInWithGoogle}>Sign in with Google</Button>
      </Stack>
    </Layout>
  )
}

export default SigninPage

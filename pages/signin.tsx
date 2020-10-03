import React from 'react'
import { useRouter } from 'next/router'
import { Button, Stack, Spinner, Box, Text } from '@chakra-ui/core'
import { useAuth } from '../utils/useAuth'
import Layout from '../components/Layout'
import Link from 'next/link'

function SigninPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth((store) => store)
  const { listenForAuthStateChange, signInWithGoogle } = useAuth((store) => store.actions)

  React.useEffect(() => {
    listenForAuthStateChange({ onSuccess: () => router.push('/app'), onFailure: () => router.push('/signin') })
  }, [])

  if (isLoading) {
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
      <Stack p="4" maxW="sm" mx="auto" width="full">
        <Link href="/">
          <Text color="teal.300" fontSize="xl" textDecoration="underline" fontWeight="bold">
            Rpetify
          </Text>
        </Link>
        <Box pt="40">
          <Button width="full" size="lg" onClick={signInWithGoogle}>
            Sign in with Google
          </Button>
        </Box>
      </Stack>
    </Layout>
  )
}

export default SigninPage

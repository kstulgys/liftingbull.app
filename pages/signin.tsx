import { Box, Button, Stack, Select, Text } from '@chakra-ui/core'
import { useAuth } from '../utils/useAuth'
import nextCookie from 'next-cookies'
import fetch from 'node-fetch'

function SigninPage() {
  const { user, loading } = useAuth((store) => store)
  const { signInWithGoogle } = useAuth((store) => store.actions)
  // if (loading) return 'Loading...'

  return (
    <Stack>
      <Button onClick={signInWithGoogle}>No token</Button>
    </Stack>
  )
}

export default SigninPage

import { Box, Button, Stack, Select, Text } from '@chakra-ui/core'
import { useAuth } from '../utils/useAuth'
import nextCookie from 'next-cookies'
import fetch from 'node-fetch'

export default function SigninPage() {
  const { user, loading } = useAuth((store) => store)
  const { signInWithGoogle } = useAuth((store) => store.actions)
  // if (loading) return 'Loading...'

  return (
    <Stack>
      <Button onClick={signInWithGoogle}>No token</Button>
    </Stack>
  )
}

// SigninPage.getInitialProps = async (ctx) => {
//   if (typeof window === 'undefined') {
//     const tokenName = 'liftingbull-app-token'
//     const token = nextCookie(ctx)[tokenName]

//     // const redirectToApp = () => {
//     //   ctx.res.writeHead(301, { Location: '/' })
//     //   ctx.res.end()
//     // }

//     if (!token) return {}
//     try {
//       const headers = {
//         'Content-Type': 'application/json',
//         Authorization: JSON.stringify({ token }),
//       }
//       await fetch('http://localhost:3000/api/validate', { headers })
//       return {}
//     } catch (error) {
//       return {}
//     }
//   }
//   return {}
// }

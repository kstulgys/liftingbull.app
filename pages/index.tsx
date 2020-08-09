import { useEffect } from 'react'
import { Box, Button, Stack, Select } from '@chakra-ui/core'
import { AppDrawer } from '../components/AppDrawer'
import { ExerciseProps } from '../components/ExerciseProps'
import { useStore } from '../utils/store'
import { ExerciseSets } from '../components/ExerciseSets'
import { useSyncStorage } from '../utils/hooks'
import Head from 'next/head'
import { useAuth } from '../utils/useAuth'
import nextCookie from 'next-cookies'
import fetch from 'node-fetch'
import { useRouter } from 'next/dist/client/router'

export default function IndexPage() {
  const { initializeState, addWorkout } = useStore((store) => store.actions)
  const { signout, signInWithGoogle } = useAuth((state) => state.actions)
  const { user, loading } = useAuth((state) => state)
  const router = useRouter()

  useSyncStorage()
  useEffect(() => initializeState(), [])

  return (
    <Box>
      <Head>
        <title>LiftingBull | App</title>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700;800;900&display=swap" rel="stylesheet"></link>
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff"></meta>
      </Head>

      <Stack bg="gray.900" fontFamily="Montserrat">
        <Stack shouldWrapChildren maxW="sm" width="full" mx="auto" minH="100vh" p="4">
          <AppDrawer />
          <ExerciseList />
          <Button
            mt="2"
            width="full"
            fontWeight="bold"
            variant="ghost"
            color="cyan.300"
            // onClick={addWorkout}
            // onClick={signInWithGoogle}
            onClick={signout}
            size="lg"
            rounded="full"
            fontSize="xl"
            border="4px solid"
            borderColor="cyan.300"
            _hover={{
              bg: 'cyan.300',
              color: 'gray.900',
            }}
          >
            Add Exercise
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

// export async function getServerSideProps(ctx) {
//   if (typeof window === 'undefined') {
//     const tokenName = 'liftingbull-app-token'
//     const token = nextCookie(ctx)[tokenName] || null

//     const headers = {
//       'Content-Type': 'application/json',
//       Authorization: JSON.stringify({ token }),
//     }
//     // try {
//     const response = await fetch('http://localhost:3000/api/validate', { headers })
//     // console.log({ response })
//     return { props: {} }
//     // } catch (e) {
//     //   ctx.res.writeHead(301, { Location: '/signin' })
//     //   ctx.res.end()
//     // }
//   }
//   return { props: {} }
// }

function ExerciseList() {
  const { currentWorkoutProps, oneRepMaxProps } = useStore((store) => store)
  const { removeWorkout, addWorkoutSet } = useStore((store) => store.actions)

  return (
    <Stack spacing="4" mt="2">
      {currentWorkoutProps?.map((exercise, idx) => {
        return (
          <Stack
            fontSize="xl"
            color="cyan.300"
            key={exercise.id}
            p="1"
            bg="gray.900"
            rounded="20px"
            border="4px solid"
            borderColor="cyan.300"
            shouldWrapChildren
          >
            <Stack isInline>
              <Box flex="0.5">
                <Button
                  _hover={{
                    bg: 'gray.900',
                  }}
                  bg="gray.900"
                  fontWeight="black"
                  width="full"
                  onClick={() => addWorkoutSet(idx)}
                >
                  +
                </Button>
              </Box>
              <Box flex="1">
                <Select backgroundColor="gray.900" borderColor="gray.900" color="cyan.300" fontWeight="bold" text-align-last="center">
                  {oneRepMaxProps.map(({ name }) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box flex="0.5">
                <Button
                  _hover={{
                    bg: 'gray.900',
                  }}
                  bg="gray.900"
                  fontWeight="black"
                  width="full"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this workout?')) removeWorkout(exercise.id)
                  }}
                >
                  x
                </Button>
              </Box>
            </Stack>
            <ExerciseProps exercise={exercise} exerciseIdx={idx} />
            <ExerciseSets exercise={exercise} />
          </Stack>
        )
      })}
    </Stack>
  )
}

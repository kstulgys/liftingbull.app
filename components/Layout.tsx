import Head from 'next/head'
import { Box, Stack } from '@chakra-ui/core'

export default function Layout({ children }) {
  return (
    <Box>
      <Head>
        <title>Rpetify | RPE based weight calculator App</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="RPE based weight calculator App for weightlifters, powerlifters, bodybuilders" />
        <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </Head>
      <Stack width="full" minH="100vh" height="full" spacing="0" bg="gray.900" fontFamily="Ubuntu">
        {children}
      </Stack>
    </Box>
  )
}

import Head from 'next/head'
import { Box, Stack } from '@chakra-ui/core'

export default function Layout({ children }) {
  return (
    <Box>
      <Head>
        {/* <meta name="theme-color" content='black'/> */}
        <title>LiftingBull | App</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/images/pwa-192.png" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700;800;900&display=swap" rel="stylesheet"></link>
      </Head>
      <Stack w="full" spacing="0" bg="gray.900" fontFamily="Montserrat">
        {children}
      </Stack>
    </Box>
  )
}

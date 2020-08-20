import Head from 'next/head'
import { Box, Stack } from '@chakra-ui/core'

export default function Layout({ children }) {
  return (
    <Box>
      <Head>
        {/* <meta name="theme-color" content='black'/> */}
        <title>LiftingBull | App</title>
        <meta name="application-name" content="Lifting Bull" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Lifting Bull" />
        <meta name="description" content="Lifting Bull" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover" />

        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/icons/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>
      <Stack w="full" spacing="0" bg="gray.900" fontFamily="Montserrat">
        {children}
      </Stack>
    </Box>
  )
}

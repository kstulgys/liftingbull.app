import React, { useEffect } from 'react'
import { ThemeProvider, CSSReset, Button } from '@chakra-ui/core'
import { AppProps } from 'next/app'
import { useAuth } from '../utils/useAuth'
import 'firebase/firestore'
import 'firebase/auth'
import { Fuego, FuegoProvider } from '@nandorojo/swr-firestore'
import { useRouter } from 'next/dist/client/router'
// import { useStore } from '../utils/store'
import { ChakraProvider, theme } from '@chakra-ui/core'

function App({ Component, pageProps }: AppProps) {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_apiKey,
    authDomain: process.env.NEXT_PUBLIC_authDomain,
    projectId: process.env.NEXT_PUBLIC_projectId,
    appId: process.env.NEXT_PUBLIC_appId,
  }

  const fuego = new Fuego(firebaseConfig)

  return (
    <ChakraProvider resetCSS theme={theme}>
      <FuegoProvider fuego={fuego}>
        <Component {...pageProps} />
      </FuegoProvider>
    </ChakraProvider>
  )
}

export default App
// uid={'1wpf1qe4tYfj2UV9tOTNJKed5s63'}

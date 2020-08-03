import React, { useEffect } from 'react'
import { ThemeProvider, CSSReset, Button } from '@chakra-ui/core'
import { AppProps, AppContext } from 'next/app'
import { useAuth } from '../utils/useAuth'
import { useRouter } from 'next/dist/client/router'

export default function App({ Component, pageProps }: AppProps) {
  const { listenForAuthStateChange } = useAuth((store) => store.actions)
  const router = useRouter()
  useEffect(
    () =>
      listenForAuthStateChange(
        () => router.push('/'),
        () => router.push('/signin')
      ),
    []
  )

  return (
    <ThemeProvider>
      <CSSReset />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

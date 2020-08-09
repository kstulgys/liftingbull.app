import React, { useEffect } from 'react'
import { ThemeProvider, CSSReset, Button } from '@chakra-ui/core'
import { AppProps, AppContext } from 'next/app'
import { useAuth } from '../utils/useAuth'
import { useRouter } from 'next/dist/client/router'
import { useStore } from '../utils/store'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { user } = useAuth((store) => store)
  const { listenForAuthStateChange } = useAuth((store) => store.actions)
  const { getUserSettings } = useStore((store) => store.actions)

  useEffect(() => {
    listenForAuthStateChange({ onSuccess: () => router.push('/'), onFailure: () => router.push('/signin') })
  }, [])

  useEffect(() => {
    if (!user) return
    return getUserSettings(user.uid)
  }, [user])

  return (
    <ThemeProvider>
      <CSSReset />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

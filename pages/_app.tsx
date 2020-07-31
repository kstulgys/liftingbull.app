import { ThemeProvider, CSSReset } from '@chakra-ui/core'

export default function App({ Component, pageProps }: any) {
  return (
    <ThemeProvider>
      <CSSReset />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

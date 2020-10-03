import { ChakraProvider, theme } from '@chakra-ui/core'
import { AppProps } from 'next/app'

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default App

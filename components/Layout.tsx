import Head from 'next/head'
import { Box, Stack } from '@chakra-ui/core'

export default function Layout({ children }) {
  return (
    <Box>
      <Head>
        <title>Rpetify | RPE based weight calculator App</title>
        <meta name="description" content="RPE based weight calculator App for weightlifters, powerlifters, bodybuilders" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover" />
        <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <script
          data-name="BMC-Widget"
          src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
          data-id="kstulgys"
          data-description="Support me on Buy me a coffee!"
          data-message="Thank you for visiting. You can now buy me a coffee!"
          data-color="#39B2AB"
          data-position=""
          data-x_margin="18"
          data-y_margin="18"
        />
      </Head>
      <Stack width="full" minH="100vh" height="full" spacing="0" bg="gray.900" fontFamily="Ubuntu">
        {children}
      </Stack>
    </Box>
  )
}

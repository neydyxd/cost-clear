import React from 'react'
import './styles.css'
import { ChakraProvider } from '@chakra-ui/react'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <main>{children}</main>
        </ChakraProvider>
      </body>
    </html>
  )
}

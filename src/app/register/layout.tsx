'use client'

import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ChakraProvider>{children}</ChakraProvider>
      </body>
    </html>
  )
}

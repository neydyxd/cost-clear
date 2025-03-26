'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from '../context/AuthContext'
export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AuthProvider>
        <ChakraProvider>{children}</ChakraProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

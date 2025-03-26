import React from 'react'
import './styles.css'
import { ChakraProvider, Box } from '@chakra-ui/react'
import { AuthProvider } from '@/app/context/AuthContext'
import Header from '@/app/components/Header'
import Background from '@/app/components/Background'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ChakraProvider>
            <Background>
              <Header />
              <Box as="main" pt="70px">
                {children}
              </Box>
            </Background>
          </ChakraProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

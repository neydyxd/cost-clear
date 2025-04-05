import React from 'react'
import './styles.css'
import { Box } from '@chakra-ui/react'
import Header from '@/app/components/Header'
import Background from '@/app/components/Background'
import { inter } from '../fonts'
import { Providers } from '../providers'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
      <body>
        <Providers>
          <Background>
            <Header />
            <Box as="main" pt="70px">
              {children}
            </Box>
          </Background>
        </Providers>
      </body>
    </html>
  )
}

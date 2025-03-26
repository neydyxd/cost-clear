'use client'

import { Box } from '@chakra-ui/react'

export default function Background({ children }: { children: React.ReactNode }) {
  return (
    <Box minH="100vh" bgGradient="linear(to-r, gray.800, gray.900)" color="white">
      {children}
    </Box>
  )
}

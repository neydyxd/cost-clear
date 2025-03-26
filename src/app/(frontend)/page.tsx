'use client'

import React, { useEffect, useState } from 'react'
import { Box, Button, Text } from '@chakra-ui/react'
import './styles.css'
import TypingText from './components/TypingText/TypingText'

export default function HomePage() {
  const [showTitle, setShowTitle] = useState(true)

  const handleTypingComplete = () => {
    setTimeout(() => {
      setShowTitle(false)
    }, 1000) // Задержка 1 секунда перед скрытием названия
  }

  return (
    <Box>
      {showTitle ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          bgGradient="linear(to-r, gray.800, gray.900)"
          className="title-container"
        >
          <Text
            fontSize="6xl"
            fontWeight="bold"
            color="white"
            fontFamily="'Poppins', sans-serif"
            className="title"
            mb={4}
          >
            Cost Clear
          </Text>
          <Text fontSize="2xl" color="white" textAlign="center" maxW="600px" px={4}>
            <TypingText
              text="Добро пожаловать в Cost Clear! Здесь вы можете управлять своими финансами и достигать своих целей. Начните прямо сейчас!"
              handleTypingComplete={handleTypingComplete}
            />
          </Text>
        </Box>
      ) : (
        <div className="home">
          <Text>
            Привет
          </Text>
        </div>
      )}
    </Box>
  )
}

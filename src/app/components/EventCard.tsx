'use client'

import React from 'react'
import {
  Box,
  Text,
  Image,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  Heading,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { CalendarIcon } from '@chakra-ui/icons'
interface EventCardProps {
  id: string
  title: string
  description: string
  date: string
  location: string
  imageUrl: string
  category: string
  totalCost: number
  participants: {
    id: string
    name: string
    role: string
    paid: number
    owes: number
    items: string[]
  }[]
  expenses: {
    id: string
    description: string
    amount: number
    paidBy: string
    date: string
  }[]
}

export default function EventCard({
  id,
  title,
  description,
  date,
  location,
  imageUrl,
  category,
  totalCost,
  participants,
  expenses,
}: EventCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/events/${id}`)
  }

  return (
    <Box
      onClick={handleClick}
      cursor="pointer"
      bg="gray.800"
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
      position="relative"
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box position="relative" width="100%" paddingTop="56.25%" overflow="hidden">
        <Image
          src={imageUrl}
          alt={title}
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          objectFit="cover"
          transition="transform 0.3s"
          _groupHover={{ transform: 'scale(1.05)' }}
        />
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bgGradient="linear(to-b, transparent 0%, rgba(0,0,0,0.7) 100%)"
          opacity="0"
          transition="opacity 0.3s"
          _groupHover={{ opacity: 1 }}
        />
      </Box>

      <VStack p={4} spacing={2} align="stretch" flex="1" bg="gray.800">
        <HStack justify="space-between">
          <Text color="teal.400" fontSize="sm" fontWeight="medium" textTransform="uppercase">
            {category}
          </Text>
          <Text color="white" fontSize="sm" fontWeight="bold">
            {totalCost.toLocaleString('ru-RU')} ₽
          </Text>
        </HStack>

        <Heading size="md" color="white" noOfLines={2}>
          {title}
        </Heading>

        <Text color="gray.400" fontSize="sm" noOfLines={2}>
          {description}
        </Text>

        <VStack spacing={2} color="gray.400" fontSize="sm" align="start">
          <HStack>
            <CalendarIcon />
            <Text>{date}</Text>
          </HStack>
          <Text>{location}</Text>
        </VStack>

        <HStack spacing={2} color="gray.400" fontSize="sm">
          <Text>{participants.length} участников</Text>
        </HStack>
      </VStack>
    </Box>
  )
}

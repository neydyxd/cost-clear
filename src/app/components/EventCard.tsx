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

const EventCard: React.FC<EventCardProps> = ({
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
}) => {
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
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
      position="relative"
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box position="relative" height="200px">
        <Image
          src={imageUrl}
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
          transition="transform 0.3s"
          _groupHover={{ transform: 'scale(1.1)' }}
        />
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)"
        />
        <Text
          position="absolute"
          top="4"
          right="4"
          bg="blue.500"
          color="white"
          px="3"
          py="1"
          borderRadius="full"
          fontSize="sm"
        >
          {category}
        </Text>
      </Box>
      <Box p="6" flex="1" display="flex" flexDirection="column">
        <Heading size="md" color="white" mb="2">
          {title}
        </Heading>
        <Text color="gray.300" fontSize="sm" mb="4" flex="1">
          {description}
        </Text>
        <Box mt="auto">
          <Text color="gray.400" fontSize="sm" mb="2">
            {date}
          </Text>
          <Text color="gray.400" fontSize="sm" mb="2">
            {location}
          </Text>
          <Text color="white" fontSize="lg" fontWeight="bold">
            Общая стоимость: {totalCost} ₽
          </Text>
          <Text color="gray.400" fontSize="sm">
            Участников: {participants.length}
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export default EventCard

'use client'

import React from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Badge,
  Button,
  Divider,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from '@chakra-ui/react'
import { useParams } from 'next/navigation'

// Моковые данные (в реальном приложении будут загружаться с сервера)
const mockEvent = {
  id: '1',
  title: 'Пикник в парке',
  description:
    'Весенний пикник с играми, музыкой и вкусной едой. Приглашаем всех желающих присоединиться к нашему дружному коллективу!',
  date: '10 июня 2024',
  time: '12:00',
  location: 'Центральный парк',
  address: 'ул. Парковая, 1',
  imageUrl:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
  category: 'Отдых',
  totalCost: 5000,
  participants: [
    {
      id: '1',
      name: 'Алексей Петров',
      role: 'организатор',
      paid: 2000,
      owes: 0,
      items: ['Мангал', 'Уголь'],
    },
    {
      id: '2',
      name: 'Мария Иванова',
      role: 'участник',
      paid: 1000,
      owes: 500,
      items: ['Салаты'],
    },
    {
      id: '3',
      name: 'Дмитрий Сидоров',
      role: 'участник',
      paid: 0,
      owes: 1000,
      items: ['Мясо'],
    },
  ],
  expenses: [
    {
      id: '1',
      description: 'Мангал и уголь',
      amount: 2000,
      paidBy: 'Алексей Петров',
      date: '2024-06-10',
    },
    {
      id: '2',
      description: 'Мясо',
      amount: 3000,
      paidBy: 'Дмитрий Сидоров',
      date: '2024-06-10',
    },
  ],
}

export default function EventPage() {
  const params = useParams()
  const toast = useToast()

  // Расчет общей суммы долгов
  const totalDebts = mockEvent.participants.reduce((sum, participant) => sum + participant.owes, 0)

  // Расчет общей суммы оплаченных средств
  const totalPaid = mockEvent.participants.reduce((sum, participant) => sum + participant.paid, 0)

  // Расчет прогресса оплаты
  const paymentProgress = (totalPaid / mockEvent.totalCost) * 100

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box position="relative" height="400px" borderRadius="lg" overflow="hidden">
          <Image
            src={mockEvent.imageUrl}
            alt={mockEvent.title}
            objectFit="cover"
            width="100%"
            height="100%"
          />
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            p={6}
            bgGradient="linear(to-t, blackAlpha.800, transparent)"
          >
            <Badge colorScheme="teal" borderRadius="full" px={3} py={1} mb={2}>
              {mockEvent.category}
            </Badge>
            <Heading color="white" size="2xl">
              {mockEvent.title}
            </Heading>
          </Box>
        </Box>

        <StatGroup>
          <Stat>
            <StatLabel color="gray.400">Общая стоимость</StatLabel>
            <StatNumber color="white">{mockEvent.totalCost} ₽</StatNumber>
            <StatHelpText color="gray.400">
              <StatArrow type="increase" />
              Оплачено {paymentProgress.toFixed(1)}%
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel color="gray.400">Оплачено</StatLabel>
            <StatNumber color="white">{totalPaid} ₽</StatNumber>
            <StatHelpText color="gray.400">
              <StatArrow type="increase" />
              {mockEvent.participants.length} участников
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel color="gray.400">Долги</StatLabel>
            <StatNumber color="red.400">{totalDebts} ₽</StatNumber>
            <StatHelpText color="gray.400">
              <StatArrow type="decrease" />
              Требует погашения
            </StatHelpText>
          </Stat>
        </StatGroup>

        <Progress value={paymentProgress} colorScheme="teal" size="lg" borderRadius="full" />

        <HStack spacing={8} align="start">
          <Box flex={1}>
            <VStack spacing={6} align="stretch">
              <Heading size="lg" color="white">
                О мероприятии
              </Heading>
              <Text color="gray.300" fontSize="lg">
                {mockEvent.description}
              </Text>

              <Divider borderColor="gray.600" />

              <VStack spacing={4} align="stretch">
                <HStack>
                  <Text color="gray.400" fontWeight="bold" width="150px">
                    Дата:
                  </Text>
                  <Text color="white">{mockEvent.date}</Text>
                </HStack>
                <HStack>
                  <Text color="gray.400" fontWeight="bold" width="150px">
                    Время:
                  </Text>
                  <Text color="white">{mockEvent.time}</Text>
                </HStack>
                <HStack>
                  <Text color="gray.400" fontWeight="bold" width="150px">
                    Место:
                  </Text>
                  <Text color="white">{mockEvent.location}</Text>
                </HStack>
                <HStack>
                  <Text color="gray.400" fontWeight="bold" width="150px">
                    Адрес:
                  </Text>
                  <Text color="white">{mockEvent.address}</Text>
                </HStack>
              </VStack>

              <Divider borderColor="gray.600" />

              <Box>
                <Heading size="md" color="white" mb={4}>
                  Участники
                </Heading>
                <Table variant="simple" colorScheme="whiteAlpha">
                  <Thead>
                    <Tr>
                      <Th color="gray.400">Имя</Th>
                      <Th color="gray.400">Роль</Th>
                      <Th color="gray.400">Оплачено</Th>
                      <Th color="gray.400">Долг</Th>
                      <Th color="gray.400">За что отвечает</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {mockEvent.participants.map((participant) => (
                      <Tr key={participant.id}>
                        <Td color="white">{participant.name}</Td>
                        <Td color="gray.300">{participant.role}</Td>
                        <Td color="green.400">{participant.paid} ₽</Td>
                        <Td color={participant.owes > 0 ? 'red.400' : 'gray.300'}>
                          {participant.owes} ₽
                        </Td>
                        <Td color="gray.300">{participant.items.join(', ')}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>

              <Divider borderColor="gray.600" />

              <Box>
                <Heading size="md" color="white" mb={4}>
                  Расходы
                </Heading>
                <Table variant="simple" colorScheme="whiteAlpha">
                  <Thead>
                    <Tr>
                      <Th color="gray.400">Описание</Th>
                      <Th color="gray.400">Сумма</Th>
                      <Th color="gray.400">Оплатил</Th>
                      <Th color="gray.400">Дата</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {mockEvent.expenses.map((expense) => (
                      <Tr key={expense.id}>
                        <Td color="white">{expense.description}</Td>
                        <Td color="gray.300">{expense.amount} ₽</Td>
                        <Td color="gray.300">{expense.paidBy}</Td>
                        <Td color="gray.300">{expense.date}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>

              <Divider borderColor="gray.600" />

              <Box>
                <Heading size="md" color="white" mb={4}>
                  Кому я должен
                </Heading>
                <VStack spacing={4} align="stretch">
                  {mockEvent.participants.map((participant) => {
                    if (participant.owes > 0) {
                      return (
                        <Box
                          key={participant.id}
                          bg="gray.800"
                          p={4}
                          borderRadius="lg"
                          border="1px"
                          borderColor="red.500"
                        >
                          <Text color="white" fontWeight="bold">
                            {participant.name}
                          </Text>
                          <Text color="red.400" fontSize="lg">
                            Должен {participant.owes} ₽
                          </Text>
                          <Text color="gray.400" fontSize="sm">
                            За что: {participant.items.join(', ')}
                          </Text>
                        </Box>
                      )
                    }
                    return null
                  })}
                </VStack>
              </Box>

              <Divider borderColor="gray.600" />

              <Box>
                <Heading size="md" color="white" mb={4}>
                  Кто мне должен
                </Heading>
                <VStack spacing={4} align="stretch">
                  {mockEvent.participants.map((participant) => {
                    if (participant.owes > 0) {
                      return (
                        <Box
                          key={participant.id}
                          bg="gray.800"
                          p={4}
                          borderRadius="lg"
                          border="1px"
                          borderColor="green.500"
                        >
                          <Text color="white" fontWeight="bold">
                            {participant.name}
                          </Text>
                          <Text color="green.400" fontSize="lg">
                            Должен мне {participant.owes} ₽
                          </Text>
                          <Text color="gray.400" fontSize="sm">
                            За что: {participant.items.join(', ')}
                          </Text>
                        </Box>
                      )
                    }
                    return null
                  })}
                </VStack>
              </Box>
            </VStack>
          </Box>

          <Box bg="gray.800" p={6} borderRadius="lg" width="300px" position="sticky" top={8}>
            <VStack spacing={4} align="stretch">
              <Text color="white" fontSize="xl" fontWeight="bold">
                Добавить расход
              </Text>
              <Button colorScheme="teal" size="lg">
                Добавить
              </Button>
              <Divider borderColor="gray.600" />
              <Text color="white" fontSize="xl" fontWeight="bold">
                Погасить долг
              </Text>
              <Button colorScheme="green" size="lg">
                Погасить
              </Button>
            </VStack>
          </Box>
        </HStack>
      </VStack>
    </Container>
  )
}

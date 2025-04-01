'use client'

import React, { useEffect, useState } from 'react'
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
} from '@chakra-ui/react'
import { useParams } from 'next/navigation'

interface Event {
  id: string
  name: string
  description: string
  date: string
  location: string
  amount: number
  summ: number
  image: {
    url: string
  }
  users: Array<{
    id: string
    name: string
  }>
  actions: Array<{
    id: string
    name: string
    amount: number
    createdAt: string
    from: {
      name: string
    }
  }>
  purchases: Array<{
    id: string
    name: string
    amount: number
    date: string
    user: {
      id: string
      name: string
    }
  }>
  currentUser: {
    id: string
  }
  deptMe?: Array<{
    id: string
    name: string
    amount: number
    object: string
  }>
  deptToMe?: Array<{
    id: string
    name: string
    amount: number
    object: string
  }>
}

export default function EventPage() {
  const params = useParams()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isPurchaseOpen,
    onOpen: onPurchaseOpen,
    onClose: onPurchaseClose,
  } = useDisclosure()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    to: '',
    amount: '',
  })
  const [purchaseData, setPurchaseData] = useState({
    name: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch('/api/events/single-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ eventId: params.id }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Ошибка при загрузке события')
        }

        const data = await response.json()
        setEvent(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка')
        toast({
          title: 'Ошибка',
          description: err instanceof Error ? err.message : 'Произошла ошибка при загрузке события',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params.id, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/events/add-expensive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          eventId: params.id,
          to: formData.to,
          amount: Number(formData.amount),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Ошибка при добавлении расхода')
      }

      toast({
        title: 'Успех',
        description: 'Расход успешно добавлен',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      onClose()
      setFormData({ name: '', to: '', amount: '' })

      // Обновляем данные события
      const updatedEvent = await fetch('/api/events/single-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId: params.id }),
      }).then((res) => res.json())

      setEvent(updatedEvent)
    } catch (err) {
      toast({
        title: 'Ошибка',
        description: err instanceof Error ? err.message : 'Произошла ошибка при добавлении расхода',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleRemoveAction = async (actionId: string) => {
    try {
      const response = await fetch('/api/events/remove-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: params.id,
          actionId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Ошибка при удалении действия')
      }

      toast({
        title: 'Успех',
        description: 'Долг отмечен как погашенный',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      // Обновляем данные события
      const updatedEvent = await fetch('/api/events/single-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId: params.id }),
      }).then((res) => res.json())

      setEvent(updatedEvent)
    } catch (err) {
      toast({
        title: 'Ошибка',
        description: err instanceof Error ? err.message : 'Произошла ошибка при удалении действия',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/purchase/add-purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: purchaseData.name,
          amount: Number(purchaseData.amount),
          date: purchaseData.date,
          eventId: params.id,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Ошибка при добавлении покупки')
      }

      toast({
        title: 'Успех',
        description: 'Покупка успешно добавлена',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      onPurchaseClose()
      setPurchaseData({ name: '', amount: '', date: new Date().toISOString().split('T')[0] })

      // Обновляем данные события
      const updatedEvent = await fetch('/api/events/single-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId: params.id }),
      }).then((res) => res.json())

      setEvent(updatedEvent)
    } catch (err) {
      toast({
        title: 'Ошибка',
        description: err instanceof Error ? err.message : 'Произошла ошибка при добавлении покупки',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Progress size="xs" isIndeterminate />
        </VStack>
      </Container>
    )
  }

  if (error || !event) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Box p={6} bg="red.50" borderRadius="lg">
            <Text color="red.500">{error || 'Событие не найдено'}</Text>
          </Box>
        </VStack>
      </Container>
    )
  }

  // Расчет общей суммы долгов (моковые данные)
  const totalPaid = event.amount - event.summ
  const totalDebts = event.amount - totalPaid
  const paymentProgress = (totalPaid / event.amount) * 100

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box
          position="relative"
          height={{ base: '200px', md: '400px' }}
          borderRadius="lg"
          overflow="hidden"
        >
          <Image
            src={
              event.image?.url ||
              'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
            }
            alt={event.name}
            objectFit="cover"
            width="100%"
            height="100%"
          />
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            p={{ base: 4, md: 6 }}
            bgGradient="linear(to-t, blackAlpha.800, transparent)"
          >
            <Badge colorScheme="teal" borderRadius="full" px={3} py={1} mb={2}>
              Событие
            </Badge>
            <Heading color="white" size={{ base: 'xl', md: '2xl' }}>
              {event.name}
            </Heading>
          </Box>
        </Box>

        <StatGroup flexDirection={{ base: 'column', md: 'row' }} gap={{ base: 4, md: 0 }}>
          <Stat>
            <StatLabel color="gray.400">Общая стоимость</StatLabel>
            <StatNumber color="white">{event.amount} ₽</StatNumber>
            {!Number.isNaN(paymentProgress) && (
              <StatHelpText color="gray.400">
                <StatArrow type="increase" />
                {`Оплачено ${paymentProgress.toFixed(1)}%`}
              </StatHelpText>
            )}
          </Stat>
          <Stat>
            <StatLabel color="gray.400">Оплачено</StatLabel>
            <StatNumber color="white">{totalPaid} ₽</StatNumber>
            <StatHelpText color="gray.400">
              <StatArrow type="increase" />
              {event.users.length} участников
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

        <HStack
          spacing={{ base: 4, md: 8 }}
          align="start"
          flexDirection={{ base: 'column', md: 'row' }}
          width="100%"
        >
          <Box flex={1} width="100%">
            <VStack spacing={6} align="stretch">
              <Heading size={{ base: 'md', md: 'lg' }} color="white">
                О мероприятии
              </Heading>
              <Text color="gray.300" fontSize={{ base: 'md', md: 'lg' }}>
                {event.description}
              </Text>

              <Divider borderColor="gray.600" />

              <VStack spacing={4} align="stretch">
                <HStack>
                  <Text color="gray.400" fontWeight="bold" width={{ base: '100px', md: '150px' }}>
                    Дата:
                  </Text>
                  <Text color="white">{new Date(event.date).toLocaleDateString('ru-RU')}</Text>
                </HStack>
                <HStack>
                  <Text color="gray.400" fontWeight="bold" width={{ base: '100px', md: '150px' }}>
                    Место:
                  </Text>
                  <Text color="white">{event.location}</Text>
                </HStack>
              </VStack>

              <Divider borderColor="gray.600" />
              <Divider borderColor="gray.600" />
              <Box overflowX="auto" width="100%">
                <Heading size="md" color="white" mb={4}>
                  Участники
                </Heading>
                <Table
                  variant="simple"
                  colorScheme="whiteAlpha"
                  size={{ base: 'sm', md: 'md' }}
                  width="100%"
                >
                  <Thead>
                    <Tr>
                      <Th color="gray.400" width="50%">
                        Имя
                      </Th>
                      <Th color="gray.400" width="50%">
                        Роль
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {event.users.map((user) => (
                      <Tr key={user.id}>
                        <Td color="white">{user.name}</Td>
                        <Td color="gray.300">участник</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
              <Box overflowX="auto" width="100%">
                <Heading size="md" color="white" mb={4}>
                  Расходы
                </Heading>
                <Table
                  variant="simple"
                  colorScheme="whiteAlpha"
                  size={{ base: 'sm', md: 'md' }}
                  width="100%"
                >
                  <Thead>
                    <Tr>
                      <Th color="gray.400" width="40%">
                        Описание
                      </Th>
                      <Th color="gray.400" width="20%">
                        Сумма
                      </Th>
                      <Th color="gray.400" width="20%" display={{ base: 'none', md: 'table-cell' }}>
                        Оплатил
                      </Th>
                      <Th color="gray.400" width="20%" display={{ base: 'none', md: 'table-cell' }}>
                        Дата
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {event.purchases?.map((purchase) => (
                      <Tr key={purchase.id}>
                        <Td color="white">{purchase.name}</Td>
                        <Td color="gray.300">{purchase.amount} ₽</Td>
                        <Td color="gray.300" display={{ base: 'none', md: 'table-cell' }}>
                          {purchase.user.name}
                        </Td>
                        <Td color="gray.300" display={{ base: 'none', md: 'table-cell' }}>
                          {new Date(purchase.date).toLocaleDateString('ru-RU')}
                        </Td>
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
                  {event.deptToMe?.map((dept) => (
                    <Box
                      key={dept.name}
                      bg="gray.800"
                      p={{ base: 3, md: 4 }}
                      borderRadius="lg"
                      border="1px"
                      borderColor="red.500"
                    >
                      <Text color="white" fontWeight="bold">
                        {dept.name}
                      </Text>
                      <Text color="red.400" fontSize={{ base: 'md', md: 'lg' }}>
                        Должен {dept.amount} ₽
                      </Text>
                      <Text color="gray.400" fontSize={{ base: 'xs', md: 'sm' }}>
                        За что: {dept.object}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              </Box>

              <Divider borderColor="gray.600" />

              <Box>
                <Heading size="md" color="white" mb={4}>
                  Кто мне должен
                </Heading>
                <VStack spacing={4} align="stretch">
                  {event.deptMe?.map((dept) => (
                    <Box
                      key={dept.name}
                      bg="gray.800"
                      p={{ base: 3, md: 3 }}
                      borderRadius="lg"
                      border="1px"
                      borderColor="green.500"
                    >
                      <HStack
                        justify="space-between"
                        align="center"
                        flexDirection={{ base: 'column', md: 'row' }}
                        spacing={{ base: 2, md: 0 }}
                      >
                        <VStack align="start" spacing={0}>
                          <Text
                            color="white"
                            fontWeight="bold"
                            fontSize={{ base: 'sm', md: 'sm' }}
                            margin="12px 0"
                          >
                            {dept.name}
                          </Text>
                          <Text
                            color="green.400"
                            fontSize={{ base: 'md', md: 'md' }}
                            margin="12px 0"
                          >
                            Должна мне {dept.amount} ₽
                          </Text>
                          <Text
                            color="gray.400"
                            fontSize={{ base: 'xs', md: 'xs' }}
                            margin="12px 0"
                          >
                            За что: {dept.object}
                          </Text>
                        </VStack>
                        <Button
                          size="xs"
                          colorScheme="green"
                          variant="outline"
                          onClick={() => handleRemoveAction(dept.id)}
                          mt={{ base: 2, md: 0 }}
                        >
                          Долг погашен
                        </Button>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </Box>

          <Box
            bg="gray.800"
            p={{ base: 4, md: 6 }}
            borderRadius="lg"
            width={{ base: '100%', md: '300px' }}
            position={{ base: 'relative', md: 'sticky' }}
            top={8}
            mt={{ base: 4, md: 0 }}
          >
            <VStack spacing={4} align="stretch">
              <Text color="white" fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold">
                Выставить счет
              </Text>
              <Button colorScheme="teal" size={{ base: 'md', md: 'lg' }} onClick={onOpen}>
                Выставить
              </Button>
              <Divider borderColor="gray.600" />
              <Text color="white" fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold">
                Добавить расход
              </Text>
              <Button colorScheme="purple" size={{ base: 'md', md: 'lg' }} onClick={onPurchaseOpen}>
                Добавить
              </Button>
            </VStack>
          </Box>
        </HStack>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg="gray.800">
          <ModalHeader color="white">Добавить расход</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel color="white">Название расхода</FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Например: Мангал и уголь"
                    bg="gray.700"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: 'gray.500' }}
                    _focus={{ borderColor: 'teal.500' }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="white">Кому</FormLabel>
                  <Select
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    placeholder="Выберите участника"
                    bg="gray.700"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: 'gray.500' }}
                    _focus={{ borderColor: 'teal.500' }}
                  >
                    {event?.users
                      .filter((user) => user.id !== event.currentUser.id)
                      .map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="white">Сумма</FormLabel>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="Введите сумму"
                    bg="gray.700"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: 'gray.500' }}
                    _focus={{ borderColor: 'teal.500' }}
                  />
                </FormControl>

                <Button type="submit" colorScheme="teal" width="full" mt={4}>
                  Добавить расход
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isPurchaseOpen} onClose={onPurchaseClose} size="md">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg="gray.800">
          <ModalHeader color="white">Добавить покупку</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={6}>
            <form onSubmit={handlePurchaseSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel color="white">Название покупки</FormLabel>
                  <Input
                    value={purchaseData.name}
                    onChange={(e) => setPurchaseData({ ...purchaseData, name: e.target.value })}
                    placeholder="Например: Продукты"
                    bg="gray.700"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: 'gray.500' }}
                    _focus={{ borderColor: 'purple.500' }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="white">Сумма</FormLabel>
                  <Input
                    type="number"
                    value={purchaseData.amount}
                    onChange={(e) => setPurchaseData({ ...purchaseData, amount: e.target.value })}
                    placeholder="Введите сумму"
                    bg="gray.700"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: 'gray.500' }}
                    _focus={{ borderColor: 'purple.500' }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="white">Дата</FormLabel>
                  <Input
                    type="date"
                    value={purchaseData.date}
                    onChange={(e) => setPurchaseData({ ...purchaseData, date: e.target.value })}
                    bg="gray.700"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: 'gray.500' }}
                    _focus={{ borderColor: 'purple.500' }}
                  />
                </FormControl>

                <Button type="submit" colorScheme="purple" width="full" mt={4}>
                  Добавить покупку
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  )
}

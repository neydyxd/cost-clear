'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Box,
  Text,
  Spinner,
  SimpleGrid,
  Container,
  Heading,
  VStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Image,
  HStack,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon, AttachmentIcon } from '@chakra-ui/icons'
import './styles.css'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import TypingText from '@/app/components/TypingText'
import EventCard from '@/app/components/EventCard'

interface User {
  id: number
  name: string
  email: string
}

interface Event {
  id: string
  name: string
  description: string
  date: string
  location: string
  image: {
    url: string
  }
  users: User[]
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

export default function HomePage() {
  const [showTitle, setShowTitle] = useState(false)
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    image: null as File | null,
    selectedUsers: [] as string[],
  })

  // Загрузка пользователей при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      fetchUsers()
    }
  }, [isOpen])

  const fetchUsers = async () => {
    setIsLoadingUsers(true)
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        // Проверяем, что data является массивом
        if (Array.isArray(data)) {
          setUsers(data)
        } else if (data.docs) {
          // Если данные приходят в формате { docs: [...] }
          setUsers(data.docs)
        } else {
          throw new Error('Неверный формат данных')
        }
      } else {
        throw new Error('Ошибка при загрузке пользователей')
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить список пользователей',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
    },
    [],
  )

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
    }
  }, [])

  const handleUserToggle = useCallback((userId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedUsers: prev.selectedUsers.includes(userId)
        ? prev.selectedUsers.filter((id) => id !== userId)
        : [...prev.selectedUsers, userId],
    }))
  }, [])

  // Загрузка событий
  const fetchEvents = useCallback(async () => {
    setIsLoadingEvents(true)
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        if (data.docs) {
          setEvents(data.docs)
        } else {
          setEvents(data)
        }
      } else {
        throw new Error('Ошибка при загрузке событий')
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить список событий',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoadingEvents(false)
    }
  }, [toast])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        const formDataToSend = new FormData()
        formDataToSend.append('name', formData.name)
        formDataToSend.append('description', formData.description)
        formDataToSend.append('date', formData.date)
        formDataToSend.append('location', formData.location)
        if (formData.image) {
          formDataToSend.append('image', formData.image)
        }
        formData.selectedUsers.forEach((userId) => {
          formDataToSend.append('users', userId)
        })

        const response = await fetch('/api/events/create-event', {
          method: 'POST',
          body: formDataToSend,
        })

        if (response.ok) {
          toast({
            title: 'Событие создано!',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
          onClose()
          setFormData({
            name: '',
            description: '',
            date: '',
            location: '',
            image: null,
            selectedUsers: [],
          })
          // Обновляем список событий
          fetchEvents()
        } else {
          throw new Error('Ошибка при создании события')
        }
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось создать событие',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    },
    [formData, toast, onClose, fetchEvents],
  )

  // Мемоизируем отфильтрованный список пользователей
  const filteredUsers = useMemo(() => {
    return users.filter((userData) => userData.id !== (user?.id ?? -1))
  }, [users, user?.id])

  // Мемоизируем компоненты формы
  const formControls = useMemo(
    () => (
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel color="white">Название</FormLabel>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            bg="gray.700"
            borderColor="gray.600"
            color="white"
            _hover={{ borderColor: 'gray.500' }}
            _focus={{ borderColor: 'teal.500' }}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel color="white">Описание</FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            bg="gray.700"
            borderColor="gray.600"
            color="white"
            _hover={{ borderColor: 'gray.500' }}
            _focus={{ borderColor: 'teal.500' }}
            rows={4}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel color="white">Дата</FormLabel>
          <Input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            bg="gray.700"
            borderColor="gray.600"
            color="white"
            _hover={{ borderColor: 'gray.500' }}
            _focus={{ borderColor: 'teal.500' }}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel color="white">Локация</FormLabel>
          <Input
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            bg="gray.700"
            borderColor="gray.600"
            color="white"
            _hover={{ borderColor: 'gray.500' }}
            _focus={{ borderColor: 'teal.500' }}
          />
        </FormControl>

        <FormControl>
          <FormLabel color="white">Изображение</FormLabel>
          <Box
            position="relative"
            height="120px"
            border="2px dashed"
            borderColor="gray.600"
            borderRadius="lg"
            overflow="hidden"
            cursor="pointer"
            _hover={{ borderColor: 'teal.500' }}
            transition="all 0.2s"
            bg={formData.image ? 'transparent' : 'gray.700'}
          >
            {formData.image ? (
              <Image
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                objectFit="cover"
                width="100%"
                height="100%"
              />
            ) : (
              <VStack height="100%" justify="center" spacing={1} p={4}>
                <AttachmentIcon w={6} h={6} color="gray.400" />
                <Text color="gray.400" fontSize="sm">
                  Нажмите для загрузки
                </Text>
              </VStack>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer',
              }}
            />
            {formData.image && (
              <IconButton
                aria-label="Удалить изображение"
                icon={<DeleteIcon />}
                position="absolute"
                top={2}
                right={2}
                colorScheme="red"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setFormData((prev) => ({ ...prev, image: null }))
                }}
                opacity={0.8}
                _hover={{ opacity: 1 }}
              />
            )}
          </Box>
        </FormControl>

        <FormControl>
          <FormLabel color="white">Участники</FormLabel>
          <VStack align="start" spacing={2}>
            {isLoadingUsers ? (
              <Spinner color="teal.500" />
            ) : (
              filteredUsers.map((userData) => (
                <Button
                  key={userData.id}
                  variant={
                    formData.selectedUsers.includes(userData.id.toString()) ? 'solid' : 'outline'
                  }
                  colorScheme={
                    formData.selectedUsers.includes(userData.id.toString()) ? 'teal' : 'gray'
                  }
                  onClick={() => handleUserToggle(userData.id.toString())}
                  width="100%"
                  justifyContent="flex-start"
                  bg={
                    formData.selectedUsers.includes(userData.id.toString())
                      ? 'teal.500'
                      : 'gray.700'
                  }
                  borderColor="gray.500"
                  color="white"
                  _hover={{
                    bg: formData.selectedUsers.includes(userData.id.toString())
                      ? 'teal.600'
                      : 'gray.600',
                    borderColor: 'gray.400',
                  }}
                  _active={{
                    bg: formData.selectedUsers.includes(userData.id.toString())
                      ? 'teal.700'
                      : 'gray.500',
                  }}
                >
                  {userData.name}
                </Button>
              ))
            )}
          </VStack>
        </FormControl>

        <Button type="submit" colorScheme="teal" width="100%" mt={4}>
          Создать событие
        </Button>
      </VStack>
    ),
    [
      formData,
      handleInputChange,
      handleImageChange,
      handleUserToggle,
      isLoadingUsers,
      filteredUsers,
    ],
  )

  const handleTypingComplete = () => {
    setTimeout(() => {
      setShowTitle(false)
      localStorage.setItem('hasSeenWelcome', 'true')
    }, 1000)
  }

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log('Not authenticated, redirecting to login')
      router.push('/login')
      return
    }

    if (!authLoading) {
      setIsLoading(false)
      const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome')
      if (!hasSeenWelcome) {
        setShowTitle(true)
      }
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.removeItem('hasSeenWelcome')
    }
  }, [isAuthenticated])

  // Загрузка событий при монтировании компонента
  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents()
    }
  }, [isAuthenticated, fetchEvents])

  if (isLoading || authLoading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
        <Spinner size="xl" color="white" />
      </Box>
    )
  }

  return (
    <Box>
      {showTitle && isAuthenticated && user && !localStorage.getItem('hasSeenWelcome') ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
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
              text={`Добро пожаловать в Cost Clear, ${user.name}! Здесь вы можете управлять своими финансами и достигать своих целей. Начните прямо сейчас!`}
              handleTypingComplete={handleTypingComplete}
            />
          </Text>
        </Box>
      ) : (
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8} align="stretch">
            <HStack justify="space-between">
              <Heading color="white">Мероприятия</Heading>
              <Button
                leftIcon={<AddIcon />}
                colorScheme="teal"
                onClick={onOpen}
                size={{ base: 'sm', md: 'md' }}
              >
                Создать событие
              </Button>
            </HStack>
            {isLoadingEvents ? (
              <Box display="flex" justifyContent="center" py={8}>
                <Spinner size="xl" color="teal.500" />
              </Box>
            ) : events.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Text color="gray.400" fontSize="lg">
                  У вас пока нет мероприятий. Создайте первое!
                </Text>
              </Box>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.name}
                    description={event.description}
                    date={new Date(event.date).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                    location={event.location}
                    imageUrl={
                      event.image?.url || 'https://via.placeholder.com/400x300?text=Нет+изображения'
                    }
                    category="Мероприятие"
                    totalCost={event.totalCost || 0}
                    participants={event.participants || []}
                    expenses={event.expenses || []}
                  />
                ))}
              </SimpleGrid>
            )}
          </VStack>
        </Container>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'xl' }}>
        <ModalOverlay />
        <ModalContent bg="gray.800">
          <ModalHeader color="white">Создание нового события</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={8}>
            <form onSubmit={handleSubmit}>{formControls}</form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

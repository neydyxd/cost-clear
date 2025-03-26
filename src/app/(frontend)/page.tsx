'use client'

import React, { useState, useEffect } from 'react'
import { Box, Text, Spinner, SimpleGrid, Container, Heading, VStack } from '@chakra-ui/react'
import './styles.css'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import TypingText from '@/app/components/TypingText'
import EventCard from '@/app/components/EventCard'

// Моковые данные для мероприятий
const mockEvents = [
  {
    id: '1',
    title: 'Концерт классической музыки',
    description: 'Великолепный вечер классической музыки в исполнении лучших музыкантов города',
    date: '25 апреля 2024',
    location: 'Концертный зал',
    imageUrl:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Музыка',
    totalCost: 15000,
    participants: [
      {
        id: '1',
        name: 'Александр Соколов',
        role: 'организатор',
        paid: 5000,
        owes: 0,
        items: ['Аренда зала'],
      },
      {
        id: '2',
        name: 'Елена Морозова',
        role: 'участник',
        paid: 3000,
        owes: 1000,
        items: ['Билеты'],
      },
    ],
    expenses: [
      {
        id: '1',
        description: 'Аренда зала',
        amount: 5000,
        paidBy: 'Александр Соколов',
        date: '2024-04-25',
      },
    ],
  },
  {
    id: '2',
    title: 'Мастер-класс по живописи',
    description: 'Научитесь создавать прекрасные картины под руководством опытного художника',
    date: '30 апреля 2024',
    location: 'Художественная студия',
    imageUrl:
      '',
    category: 'Искусство',
    totalCost: 8000,
    participants: [
      {
        id: '1',
        name: 'Мария Иванова',
        role: 'организатор',
        paid: 3000,
        owes: 0,
        items: ['Материалы'],
      },
      {
        id: '2',
        name: 'Дмитрий Петров',
        role: 'участник',
        paid: 2000,
        owes: 500,
        items: ['Холсты'],
      },
    ],
    expenses: [
      {
        id: '1',
        description: 'Материалы для рисования',
        amount: 3000,
        paidBy: 'Мария Иванова',
        date: '2024-04-30',
      },
    ],
  },
  {
    id: '3',
    title: 'Кулинарный мастер-класс',
    description: 'Приготовьте изысканные блюда вместе с профессиональным шеф-поваром',
    date: '5 мая 2024',
    location: 'Кулинарная школа',
    imageUrl:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Кулинария',
    totalCost: 10000,
    participants: [
      {
        id: '1',
        name: 'Анна Кузнецова',
        role: 'организатор',
        paid: 4000,
        owes: 0,
        items: ['Продукты'],
      },
      {
        id: '2',
        name: 'Иван Смирнов',
        role: 'участник',
        paid: 2500,
        owes: 750,
        items: ['Посуда'],
      },
    ],
    expenses: [
      {
        id: '1',
        description: 'Продукты для мастер-класса',
        amount: 4000,
        paidBy: 'Анна Кузнецова',
        date: '2024-05-05',
      },
    ],
  },
  {
    id: '4',
    title: 'Йога и медитация',
    description: 'Начните свой день с энергичной практики йоги и медитации',
    date: '10 мая 2024',
    location: 'Йога-студия',
    imageUrl:
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Спорт',
    totalCost: 4000,
    participants: [
      {
        id: '1',
        name: 'Ольга Васильева',
        role: 'организатор',
        paid: 2000,
        owes: 0,
        items: ['Аренда зала'],
      },
      {
        id: '2',
        name: 'Сергей Николаев',
        role: 'участник',
        paid: 1000,
        owes: 500,
        items: ['Коврики'],
      },
    ],
    expenses: [
      {
        id: '1',
        description: 'Аренда зала',
        amount: 2000,
        paidBy: 'Ольга Васильева',
        date: '2024-05-10',
      },
    ],
  },
  {
    id: '5',
    title: 'Театральная постановка',
    description: 'Современная интерпретация классической пьесы в исполнении молодых актеров',
    date: '15 мая 2024',
    location: 'Театр "Новая сцена"',
    imageUrl:
      'https://images.unsplash.com/photo-1507924538820-ede94a04019d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Театр',
    totalCost: 7200,
    participants: [
      {
        id: '1',
        name: 'Алексей Попов',
        role: 'организатор',
        paid: 3000,
        owes: 0,
        items: ['Костюмы'],
      },
      {
        id: '2',
        name: 'Екатерина Соколова',
        role: 'участник',
        paid: 1800,
        owes: 600,
        items: ['Декорации'],
      },
    ],
    expenses: [
      {
        id: '1',
        description: 'Костюмы для спектакля',
        amount: 3000,
        paidBy: 'Алексей Попов',
        date: '2024-05-15',
      },
    ],
  },
  {
    id: '6',
    title: 'Фотография для начинающих',
    description: 'Освойте основы фотографии и научитесь создавать профессиональные снимки',
    date: '20 мая 2024',
    location: 'Фотостудия "Объектив"',
    imageUrl:
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Фотография',
    totalCost: 12000,
    participants: [
      {
        id: '1',
        name: 'Дмитрий Волков',
        role: 'организатор',
        paid: 5000,
        owes: 0,
        items: ['Оборудование'],
      },
      {
        id: '2',
        name: 'Анна Морозова',
        role: 'участник',
        paid: 3000,
        owes: 1000,
        items: ['Модели'],
      },
    ],
    expenses: [
      {
        id: '1',
        description: 'Фотооборудование',
        amount: 5000,
        paidBy: 'Дмитрий Волков',
        date: '2024-05-20',
      },
    ],
  },
  {
    id: '8',
    title: 'Винная дегустация',
    description: 'Познакомьтесь с лучшими винами мира под руководством сомелье',
    date: '30 мая 2024',
    location: 'Винный бар',
    imageUrl:
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Дегустация',
    totalCost: 14000,
    participants: [
      {
        id: '1',
        name: 'Игорь Соколов',
        role: 'организатор',
        paid: 6000,
        owes: 0,
        items: ['Вино'],
      },
      {
        id: '2',
        name: 'Мария Петрова',
        role: 'участник',
        paid: 3500,
        owes: 1250,
        items: ['Закуски'],
      },
    ],
    expenses: [
      {
        id: '1',
        description: 'Коллекция вин',
        amount: 6000,
        paidBy: 'Игорь Соколов',
        date: '2024-05-30',
      },
    ],
  },
  {
    id: '10',
    title: 'Пикник в парке',
    description: 'Весенний пикник с играми, музыкой и вкусной едой',
    date: '10 июня 2024',
    location: 'Центральный парк',
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
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
  },
  {
    id: '11',
    title: 'Курс по инвестициям',
    description: 'Научитесь грамотно инвестировать свои деньги с опытным трейдером',
    date: '15 июня 2024',
    location: 'Бизнес-центр',
    imageUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Финансы',
    totalCost: 16000,
    participants: [
      {
        id: '1',
        name: 'Андрей Смирнов',
        role: 'организатор',
        paid: 6000,
        owes: 0,
        items: ['Материалы'],
      },
      {
        id: '2',
        name: 'Елена Кузнецова',
        role: 'участник',
        paid: 4000,
        owes: 1000,
        items: ['Помещение'],
      },
    ],
    expenses: [
      {
        id: '1',
        description: 'Учебные материалы',
        amount: 6000,
        paidBy: 'Андрей Смирнов',
        date: '2024-06-15',
      },
    ],
  },
  {
    id: '12',
    title: 'Мастер-класс по гончарному делу',
    description: 'Создайте свою первую керамическую посуду своими руками',
    date: '20 июня 2024',
    location: 'Гончарная мастерская',
    imageUrl:
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Ремесло',
    totalCost: 11200,
    participants: [
      {
        id: '1',
        name: 'Татьяна Морозова',
        role: 'организатор',
        paid: 5000,
        owes: 0,
        items: ['Глина'],
      },
      {
        id: '2',
        name: 'Александр Иванов',
        role: 'участник',
        paid: 2800,
        owes: 1100,
        items: ['Инструменты'],
      },
    ],
    expenses: [
      {
        id: '1',
        description: 'Материалы для лепки',
        amount: 5000,
        paidBy: 'Татьяна Морозова',
        date: '2024-06-20',
      },
    ],
  },
  {
    id: '13',
    title: 'Корпоратив',
    description: 'Ежегодный корпоративный праздник',
    date: '15 июня 2024',
    location: 'Ресторан "Золотой"',
    imageUrl:
      'https://images.unsplash.com/photo-1511795409834-432f8c8d0a1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Корпоратив',
    totalCost: 15000,
    participants: [
      {
        id: '1',
        name: 'Анна Смирнова',
        role: 'организатор',
        paid: 5000,
        owes: 0,
        items: ['Аренда зала'],
      },
      {
        id: '2',
        name: 'Иван Кузнецов',
        role: 'участник',
        paid: 3000,
        owes: 1000,
        items: ['Напитки'],
      },
      {
        id: '3',
        name: 'Елена Попова',
        role: 'участник',
        paid: 2000,
        owes: 500,
        items: ['Десерты'],
      },
    ],
    expenses: [
      {
        id: '1',
        description: 'Аренда зала',
        amount: 5000,
        paidBy: 'Анна Смирнова',
        date: '2024-06-15',
      },
      {
        id: '2',
        description: 'Напитки',
        amount: 4000,
        paidBy: 'Иван Кузнецов',
        date: '2024-06-15',
      },
      {
        id: '3',
        description: 'Десерты',
        amount: 2500,
        paidBy: 'Елена Попова',
        date: '2024-06-15',
      },
    ],
  },
  {
    id: '14',
    title: 'Поездка на море',
    description: 'Летний отдых на побережье',
    date: '1 июля 2024',
    location: 'Черноморское побережье',
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Отдых',
    totalCost: 25000,
    participants: [
      {
        id: '1',
        name: 'Петр Николаев',
        role: 'организатор',
        paid: 10000,
        owes: 0,
        items: ['Аренда дома', 'Транспорт'],
      },
      {
        id: '2',
        name: 'Ольга Морозова',
        role: 'участник',
        paid: 5000,
        owes: 2500,
        items: ['Продукты'],
      },
      {
        id: '3',
        name: 'Сергей Волков',
        role: 'участник',
        paid: 5000,
        owes: 2500,
        items: ['Развлечения'],
      },
    ],
    expenses: [
      {
        id: '1',
        description: 'Аренда дома',
        amount: 10000,
        paidBy: 'Петр Николаев',
        date: '2024-07-01',
      },
      {
        id: '2',
        description: 'Продукты',
        amount: 7500,
        paidBy: 'Ольга Морозова',
        date: '2024-07-01',
      },
      {
        id: '3',
        description: 'Развлечения',
        amount: 7500,
        paidBy: 'Сергей Волков',
        date: '2024-07-01',
      },
    ],
  },
]

export default function HomePage() {
  const [showTitle, setShowTitle] = useState(false)
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

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
            <Heading color="white" textAlign="center" mb={8}>
              Мероприятия
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
              {mockEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      )}
    </Box>
  )
}

'use client'

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const toast = useToast()
  const { login, isAuthenticated, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  if (isAuthenticated) {
    router.push('/')
    return
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(formData.email, formData.password)

      toast({
        title: 'Успешный вход',
        description: 'Вы успешно вошли в систему!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      // Перенаправление на главную страницу после успешного входа
      router.push('/')
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Неверный email или пароль',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgGradient="linear(to-r, gray.800, gray.900)"
    >
      <Box
        w={{ base: '90%', md: 'md', lg: 'lg' }}
        bg="gray.700"
        borderRadius="lg"
        boxShadow="lg"
        p={8}
      >
        <Text
          fontSize="4xl"
          fontWeight="bold"
          textAlign="center"
          color="white"
          fontFamily="'Poppins', sans-serif"
          mb={4}
        >
          Cost Clear
        </Text>
        <Heading mb={6} textAlign="center" color="white">
          Авторизация
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel color="white">Электронная почта</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Введите электронную почту"
                bg="gray.600"
                color="white"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color="white">Пароль</FormLabel>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Введите пароль"
                bg="gray.600"
                color="white"
              />
            </FormControl>
            <Button colorScheme="teal" type="submit" width="full" isLoading={isLoading}>
              Войти
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  )
}

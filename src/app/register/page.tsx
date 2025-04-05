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
  VStack,
  HStack,
  ScaleFade,
  InputGroup,
  InputRightElement,
  IconButton,
  Fade,
  SlideFade,
  Container,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

export default function RegisterPage() {
  const router = useRouter()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  })

  // Адаптивные значения для разных размеров экрана
  const containerPadding = useBreakpointValue({ base: 4, md: 8 })
  const titleSize = useBreakpointValue({ base: '3xl', md: '4xl' })
  const headingSize = useBreakpointValue({ base: 'md', md: 'lg' })
  const inputSize = useBreakpointValue({ base: 'md', md: 'lg' })
  const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' })
  const spacing = useBreakpointValue({ base: 4, md: 6 })

  useEffect(() => {
    // Небольшая задержка для анимации появления
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

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
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Ошибка при регистрации')
      }

      toast({
        title: 'Успешная регистрация',
        description: 'Вы успешно зарегистрировались!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      // Перенаправление на страницу входа
      router.push('/login')
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при регистрации. Попробуйте еще раз.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
      py={{ base: 8, md: 0 }}
      px={{ base: 4, md: 0 }}
      bgGradient="linear(to-r, gray.800, gray.900)"
      overflow="auto"
      position="relative"
    >
      <Container maxW="container.sm" px={0} py={{ base: 4, md: 0 }}>
        <ScaleFade in={true} initialScale={0.9}>
          <Box
            w="100%"
            bg="gray.700"
            borderRadius="xl"
            boxShadow="2xl"
            p={containerPadding}
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-5px)', boxShadow: '3xl' }}
            my={{ base: 4, md: 0 }}
          >
            <VStack spacing={spacing}>
              <Fade in={showContent}>
                <Text
                  fontSize={titleSize}
                  fontWeight="bold"
                  textAlign="center"
                  color="white"
                  fontFamily="var(--font-inter)"
                  mb={4}
                  bgGradient="linear(to-r, teal.200, teal.500)"
                  bgClip="text"
                  letterSpacing="tight"
                >
                  Cost Clear
                </Text>
              </Fade>
              <SlideFade in={showContent} offsetY="20px">
                <Box
                  position="relative"
                  textAlign="center"
                  mb={4}
                  _after={{
                    content: '""',
                    position: 'absolute',
                    bottom: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60px',
                    height: '3px',
                    bgGradient: 'linear(to-r, teal.200, teal.500)',
                    borderRadius: 'full',
                  }}
                >
                  <Heading color="white" size={headingSize} fontWeight="bold">
                    Регистрация
                  </Heading>
                </Box>
              </SlideFade>
              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <Stack spacing={spacing}>
                  <SlideFade in={showContent} offsetY="20px" delay={0.1}>
                    <FormControl isRequired>
                      <FormLabel color="white" fontSize={{ base: 'sm', md: 'md' }}>
                        Имя пользователя
                      </FormLabel>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Введите имя пользователя"
                        bg="gray.600"
                        color="white"
                        size={inputSize}
                        _focus={{
                          borderColor: 'teal.500',
                          boxShadow: '0 0 0 1px teal.500',
                        }}
                        transition="all 0.2s"
                      />
                    </FormControl>
                  </SlideFade>
                  <SlideFade in={showContent} offsetY="20px" delay={0.2}>
                    <FormControl isRequired>
                      <FormLabel color="white" fontSize={{ base: 'sm', md: 'md' }}>
                        Электронная почта
                      </FormLabel>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Введите электронную почту"
                        bg="gray.600"
                        color="white"
                        size={inputSize}
                        _focus={{
                          borderColor: 'teal.500',
                          boxShadow: '0 0 0 1px teal.500',
                        }}
                        transition="all 0.2s"
                      />
                    </FormControl>
                  </SlideFade>
                  <SlideFade in={showContent} offsetY="20px" delay={0.3}>
                    <FormControl isRequired>
                      <FormLabel color="white" fontSize={{ base: 'sm', md: 'md' }}>
                        Пароль
                      </FormLabel>
                      <InputGroup size={inputSize}>
                        <Input
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Введите пароль"
                          bg="gray.600"
                          color="white"
                          _focus={{
                            borderColor: 'teal.500',
                            boxShadow: '0 0 0 1px teal.500',
                          }}
                          transition="all 0.2s"
                        />
                        <InputRightElement h="full">
                          <IconButton
                            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                            variant="ghost"
                            color="white"
                            onClick={() => setShowPassword(!showPassword)}
                            size={{ base: 'sm', md: 'md' }}
                          />
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                  </SlideFade>
                  <SlideFade in={showContent} offsetY="20px" delay={0.4}>
                    <VStack spacing={4}>
                      <Button
                        colorScheme="teal"
                        type="submit"
                        width="full"
                        size={buttonSize}
                        isLoading={isLoading}
                        loadingText="Регистрация..."
                        _hover={{
                          transform: 'translateY(-2px)',
                          boxShadow: 'lg',
                        }}
                        transition="all 0.2s"
                      >
                        Зарегистрироваться
                      </Button>
                      <HStack
                        width="full"
                        spacing={4}
                        justify="center"
                        flexDir={{ base: 'column', sm: 'row' }}
                      >
                        <Text color="gray.300" fontSize={{ base: 'sm', md: 'md' }}>
                          Уже есть аккаунт?
                        </Text>
                        <Button
                          variant="link"
                          colorScheme="teal"
                          onClick={handleLogin}
                          _hover={{ textDecoration: 'none', color: 'teal.300' }}
                          fontSize={{ base: 'sm', md: 'md' }}
                        >
                          Войти
                        </Button>
                      </HStack>
                    </VStack>
                  </SlideFade>
                </Stack>
              </form>
            </VStack>
          </Box>
        </ScaleFade>
      </Container>
    </Box>
  )
}

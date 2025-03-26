'use client'

import React, { useState } from 'react'
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Text,
  Card,
  CardBody,
  Divider,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        toast({
          title: 'Ошибка',
          description: 'Новые пароли не совпадают',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        return
      }

      await updateUser({
        name: formData.name,
        newPassword: formData.newPassword,
      })

      toast({
        title: 'Успешно',
        description: 'Профиль обновлен',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }))
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить профиль',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box maxW="600px" mx="auto" px={4} py={8}>
      <Card bg="gray.800" borderColor="gray.700">
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Heading size="lg" color="white" textAlign="center">
              Профиль пользователя
            </Heading>

            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                <FormControl>
                  <FormLabel color="white">Имя</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    bg="gray.700"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: 'gray.500' }}
                    _focus={{ borderColor: 'teal.500' }}
                  />
                </FormControl>

                <Divider borderColor="gray.600" />

                <Text color="white" fontSize="lg" fontWeight="bold">
                  Изменить пароль
                </Text>

                <FormControl>
                  <InputGroup>
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        color="gray.400"
                        _hover={{ color: 'white' }}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel color="white">Новый пароль</FormLabel>
                  <InputGroup>
                    <Input
                      name="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={formData.newPassword}
                      onChange={handleChange}
                      bg="gray.700"
                      borderColor="gray.600"
                      color="white"
                      _hover={{ borderColor: 'gray.500' }}
                      _focus={{ borderColor: 'teal.500' }}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showNewPassword ? 'Скрыть пароль' : 'Показать пароль'}
                        icon={showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        variant="ghost"
                        color="gray.400"
                        _hover={{ color: 'white' }}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel color="white">Подтвердите новый пароль</FormLabel>
                  <Input
                    name="confirmPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    bg="gray.700"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: 'gray.500' }}
                    _focus={{ borderColor: 'teal.500' }}
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="teal"
                  width="full"
                  isLoading={isLoading}
                  loadingText="Сохранение..."
                >
                  Сохранить изменения
                </Button>
              </VStack>
            </form>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  )
}

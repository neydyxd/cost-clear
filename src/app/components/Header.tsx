'use client'

import {
  Box,
  Flex,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const bgColor = useColorModeValue('gray.800', 'gray.900')
  const textColor = useColorModeValue('white', 'white')

  const handleLogout = async () => {
    await logout()
  }

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      bg={bgColor}
      boxShadow="sm"
      zIndex={1000}
    >
      <Flex maxW="1200px" mx="auto" px={4} h="70px" align="center" justify="space-between">
        {/* Логотип и название */}
        <Flex align="center" cursor="pointer" onClick={() => router.push('/')}>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color={textColor}
            fontFamily="'Poppins', sans-serif"
          >
            Cost Clear
          </Text>
        </Flex>

        {/* Правая часть с профилем */}
        <Flex align="center" gap={4}>
          <Text color={textColor} fontSize="md">
            {user?.name}
          </Text>
          <Menu>
            <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0}>
              <Avatar size="sm" name={user?.name} bg="teal.500" color="white" />
            </MenuButton>
            <MenuList bg="blue.900" borderColor="blue.700" boxShadow="2xl" borderWidth="1px">
              <MenuItem
                onClick={() => router.push('/profile')}
                _hover={{ bg: 'blue.800' }}
                color="white"
                _focus={{ bg: 'blue.800' }}
                bg="blue.900"
              >
                Профиль
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                _hover={{ bg: 'blue.800' }}
                color="white"
                _focus={{ bg: 'blue.800' }}
                bg="blue.900"
              >
                Выйти
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  )
}

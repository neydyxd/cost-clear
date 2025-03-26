import { Box, Button, FormControl, FormLabel, Input, Stack, Heading, Text } from '@chakra-ui/react'

export default function RegisterPage() {
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
          Регистрация
        </Heading>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel color="white">Имя пользователя</FormLabel>
            <Input placeholder="Введите имя пользователя" bg="gray.600" color="white" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel color="white">Электронная почта</FormLabel>
            <Input
              type="email"
              placeholder="Введите электронную почту"
              bg="gray.600"
              color="white"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel color="white">Пароль</FormLabel>
            <Input type="password" placeholder="Введите пароль" bg="gray.600" color="white" />
          </FormControl>
          <Button colorScheme="teal" type="submit" width="full">
            Зарегистрироваться
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}

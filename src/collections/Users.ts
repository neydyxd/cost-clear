import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {},
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Имя пользователя',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'user',
      options: [
        {
          label: 'Администратор',
          value: 'admin',
        },
        {
          label: 'Пользователь',
          value: 'user',
        },
      ],
    },
  ],
  endpoints: [
    {
      path: '/register',
      method: 'post',
      handler: async (req) => {
        if (!req.json) {
          return Response.json({ message: 'Неверный формат запроса' }, { status: 400 })
        }
        const data = await req.json()
        const user = await req.payload.create({
          collection: 'users',
          data: {
            name: data.name,
            email: data.email,
            password: data.password,
            role: 'user',
          },
        })
        return Response.json({ user, message: 'success' })
      },
    },
    {
      path: '/update-profile',
      method: 'post',
      handler: async (req) => {
        const user = req.user

        if (!req.json) {
          return Response.json({ message: 'Неверный формат запроса' }, { status: 400 })
        }
        const data = await req.json()
        const { name, newPassword } = data

        if (!user) {
          return Response.json({ error: 'Пользователь не авторизован' }, { status: 401 })
        }

        const updatedUser = await req.payload.update({
          collection: 'users',
          id: user.id,
          data: {
            ...(name && { name }),
            ...(newPassword && { password: newPassword }),
          },
        })

        // Удаляем чувствительные данные перед отправкой
        const { password, ...userWithoutPassword } = updatedUser

        return Response.json({
          user: userWithoutPassword,
          message: 'Профиль успешно обновлен',
        })
      },
    },
  ],
}

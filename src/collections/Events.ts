import { Action } from '@/payload-types'
import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'date',
      type: 'date',
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'users',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'actions',
      type: 'relationship',
      relationTo: 'actions',
      hasMany: true,
    },
    {
      name: 'purchases',
      type: 'relationship',
      relationTo: 'purchase',
      hasMany: true,
    },
  ],
  endpoints: [
    {
      path: '/get-events',
      method: 'get',
      handler: async (req) => {
        const user = req.user
        if (!user) {
          return Response.json({ message: 'Пожалуйста, войдите в систему' }, { status: 401 })
        }
        const events = await req.payload.find({
          collection: 'events',
          where: { users: { equals: user.id } },
        })
        return Response.json(events)
      },
    },
    {
      path: '/create-event',
      method: 'post',
      handler: async (req) => {
        if (!req.formData) {
          return Response.json({ message: 'Неверный формат запроса' }, { status: 400 })
        }
        const formData = await req.formData()

        if (!req.user) {
          return Response.json({ message: 'Пожалуйста, войдите в систему' }, { status: 401 })
        }

        // Получаем данные из FormData
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const date = formData.get('date') as string
        const location = formData.get('location') as string
        const image = formData.get('image') as File
        const users = formData.getAll('users') as string[]

        // Здесь можно добавить валидацию данных
        if (!name || !description || !date || !location) {
          return Response.json(
            { message: 'Пожалуйста, заполните все обязательные поля' },
            { status: 400 },
          )
        }

        const usersArray = users.map((user) => Number(user))
        usersArray.push(req.user.id)

        if (image instanceof File) {
          const buffer = await image.arrayBuffer()

          const fileData = {
            name: image.name,
            data: Buffer.from(buffer),
            mimetype: image.type,
            size: image.size,
          }
          const newMedia = await req.payload.create({
            collection: 'media',
            file: fileData,
            data: {
              alt: 'test',
            },
          })
          const newEvent = await req.payload.create({
            collection: 'events',
            data: {
              name,
              description,
              date,
              location,
              image: newMedia.id,
              users: usersArray,
            },
          })
        } else {
          const newEvent = await req.payload.create({
            collection: 'events',
            data: {
              name,
              description,
              date,
              location,
              users: usersArray,
            },
          })
        }

        return Response.json({
          message: 'Событие успешно создано',
        })
      },
    },
    {
      path: '/single-event',
      method: 'post',
      handler: async (req) => {
        if (!req.json) {
          return Response.json({ message: 'Неверный формат запроса' }, { status: 400 })
        }
        const { eventId } = await req.json()

        if (!req.user) {
          return Response.json({ message: 'Пожалуйста, войдите в систему' }, { status: 401 })
        }

        try {
          const event = await req.payload.findByID({
            collection: 'events',
            id: Number(eventId),
            depth: 2,
          })

          if (!event) {
            return Response.json({ message: 'Событие не найдено' }, { status: 404 })
          }

          // Получаем все действия для события
          let actions: { docs: Action[] } = { docs: [] }

          // Проверяем, есть ли действия в событии
          if (event.actions && event.actions.length > 0) {
            // Если actions - это массив объектов, а не ID
            if (typeof event.actions[0] === 'object') {
              actions = { docs: event.actions as Action[] }
            } else {
              // Если actions - это массив ID
              try {
                const result = await req.payload.find({
                  collection: 'actions',
                  where: {
                    id: {
                      in: event.actions,
                    },
                  },
                  depth: 3,
                })
                actions = result as { docs: Action[] }
              } catch (error) {
                console.error('Ошибка при получении действий:', error)
                // Продолжаем выполнение с пустым массивом действий
              }
            }
          }

          const totalExpenses = actions.docs.reduce((sum, action) => sum + Number(action.amount), 0)

          // Рассчитываем долги
          const deptMe = actions.docs
            .filter((action) => {
              const fromId = typeof action.from === 'object' ? action.from.id : action.from
              return fromId === (req.user as any).id
            })
            .map((action) => ({
              id: action.id,
              name: (action.to as any).name,
              amount: Number(action.amount),
              object: action.name,
            }))

          const deptToMe = actions.docs
            .filter((action) => {
              const toId = typeof action.to === 'object' ? action.to.id : action.to
              return toId === (req.user as any).id
            })
            .map((action) => ({
              id: action.id,
              name: (action.from as any).name,
              amount: Number(action.amount),
              object: action.name,
            }))

          return Response.json({
            ...event,
            totalExpenses,
            deptMe,
            deptToMe,
            currentUser: req.user,
          })
        } catch (error) {
          return Response.json(
            { message: 'Произошла ошибка при получении события' },
            { status: 500 },
          )
        }
      },
    },
    {
      path: '/add-expensive',
      method: 'post',
      handler: async (req) => {
        if (!req.json) {
          return Response.json({ message: 'Неверный формат запроса' }, { status: 400 })
        }
        const { name, eventId, to, amount } = await req.json()

        if (!req.user) {
          return Response.json({ message: 'Пожалуйста, войдите в систему' }, { status: 401 })
        }

        try {
          const event = await req.payload.findByID({
            collection: 'events',
            id: Number(eventId),
          })

          if (!event) {
            return Response.json({ message: 'Событие не найдено' }, { status: 404 })
          }

          const action = await req.payload.create({
            collection: 'actions',
            data: {
              name,
              from: req.user.id,
              to: Number(to),
              amount: Number(amount),
            },
          })

          const updatedEvent = await req.payload.update({
            collection: 'events',
            id: Number(eventId),
            data: {
              actions: [...(event.actions || []), action.id],
              amount: event.amount ? event.amount + Number(amount) : Number(amount),
            },
          })

          return Response.json({ action, updatedEvent })
        } catch (error) {
          return Response.json(
            { message: 'Произошла ошибка при добавлении расхода' },
            { status: 500 },
          )
        }
      },
    },
    {
      path: '/remove-action',
      method: 'post',
      handler: async (req) => {
        if (!req.json) {
          return Response.json({ message: 'Неверный формат запроса' }, { status: 400 })
        }
        const { eventId, actionId } = await req.json()

        if (!req.user) {
          return Response.json({ message: 'Пожалуйста, войдите в систему' }, { status: 401 })
        }

        try {
          const event = await req.payload.findByID({
            collection: 'events',
            id: Number(eventId),
          })

          if (!event) {
            return Response.json({ message: 'Событие не найдено' }, { status: 404 })
          }

          const updatedActions = event.actions?.filter((action) => action !== actionId) || []
          await req.payload.update({
            collection: 'events',
            id: Number(eventId),
            data: {
              actions: updatedActions,
            },
          })

          return Response.json({ message: 'Действие успешно удалено' })
        } catch (error) {
          return Response.json(
            { message: 'Произошла ошибка при удалении действия' },
            { status: 500 },
          )
        }
      },
    },
  ],
}

import { Action, Purchase } from '@/payload-types'
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
            depth: 3,
          })

          if (!event) {
            return Response.json({ message: 'Событие не найдено' }, { status: 404 })
          }

          // Получаем все действия для события
          const actions = event.actions as Action[]

          // Получаем все долги, которые должны текущему пользователю
          const deptMe = actions.flatMap((action) => {
            const depts = action.depts as Purchase[]
            return depts.filter((dept: Purchase) => {
              if (typeof dept.to === 'object' && dept.to !== null) {
                return dept.to.id === req.user?.id
              }
              return dept.to === req.user?.id
            })
          })

          const deptToMe = actions.flatMap((action) => {
            const depts = action.depts as Purchase[]
            return depts.filter((dept: Purchase) => {
              if (typeof dept.from === 'object' && dept.from !== null) {
                return dept.from.id === req.user?.id
              }
              return dept.from === req.user?.id
            })
          })

          const amount = actions.reduce((sum, action) => {
            const depts = action.depts as Purchase[]
            const actionTotal = depts.reduce((deptSum, dept) => {
              return deptSum + Number(dept.amount || 0)
            }, 0)
            return sum + actionTotal
          }, 0)

          // Рассчитываем сумму amount всех действий
          const totalExpenses = actions.reduce((sum, action) => {
            return sum + Number(action.amount || 0)
          }, 0)

          return Response.json({
            ...event,
            totalExpenses,
            amount,
            currentUser: req.user,
            deptMe,
            deptToMe
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
        const { name, eventId, amount, depts } = await req.json()

        if (!req.user) {
          return Response.json({ message: 'Пожалуйста, войдите в систему' }, { status: 401 })
        }

        try {
          const event = await req.payload.findByID({
            collection: 'events',
            id: eventId,
          })

          if (!event) {
            return Response.json({ message: 'Событие не найдено' }, { status: 404 })
          }

          // Создаем покупки для каждого долга
          const purchases: number[] = []

          // Используем Promise.all для ожидания завершения всех асинхронных операций
          await Promise.all(
            depts.map(async (dept: any) => {
              const purchase = await req.payload.create({
                collection: 'purchase',
                data: {
                  name: name,
                  amount: dept.amount,
                  from: dept.from,
                  to: dept.to,
                },
              })
              purchases.push(purchase.id)
            }),
          )

          const newAction = await req.payload.create({
            collection: 'actions',
            data: {
              name: name,
              amount: amount,
              depts: purchases,
              from: req.user.id,
            },
          })

          const updatedEvent = await req.payload.update({
            collection: 'events',
            id: eventId,
            data: {
              actions: [...(event.actions || []), newAction.id],
              amount: event.amount ? event.amount + Number(amount) : Number(amount),
            },
          })

          return Response.json(updatedEvent)
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

          await req.payload.delete({
            collection: 'purchase',
            id: Number(actionId),
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

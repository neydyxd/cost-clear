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
        const events = await req.payload.find({ collection: 'events', where: { users: { equals: user.id } } })
        return Response.json(events)
      },
    },
    {
      path: '/create-event',
      method: 'post',
      handler: async (req) => {
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
        if (!req.user) {
          return Response.json({ message: 'Пожалуйста, войдите в систему' }, { status: 401 })
        }

        try {
          const data = await req.json()
          const { eventId } = data

          if (!eventId) {
            return Response.json({ message: 'ID события не указан' }, { status: 400 })
          }

          const event = await req.payload.findByID({
            collection: 'events',
            id: eventId,
          })

          const dept_me = event.actions?.filter((action) => action.from.id === req.user.id)
          const dept_to_me = event.actions?.filter((action) => action.to.id === req.user.id)

          const summ = event.actions?.reduce((acc, action) => acc + action.amount, 0)
          const deptMeResult = dept_me?.map((action) => {
            return {
              name: action.to.name,
              amount: action.amount,
              object: action.name,
              id: action.id,
            }
          })

          const deptToMeResult = dept_to_me?.map((action) => {
            return {
              name: action.from.name,
              amount: action.amount,
              object: action.name,
              id: action.id,
            }
          })
          if (!event) {
            return Response.json({ message: 'Событие не найдено' }, { status: 404 })
          }

          // Получаем все действия с расширенными данными

          return Response.json({
            ...event,
            deptMe: deptMeResult,
            deptToMe: deptToMeResult,
            summ: summ,
            currentUser: {
              id: req.user.id,
            },
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
        if (!req.user) {
          return Response.json({ message: 'Пожалуйста, войдите в систему' }, { status: 401 })
        }

        try {
          const data = await req.json()
          const { name, eventId, to, amount } = data

          if (!eventId || !to || !amount || !name) {
            return Response.json({ message: 'ID события не указан' }, { status: 400 })
          }

          const newAction = await req.payload.create({
            collection: 'actions',
            data: {
              name: name,
              from: req.user.id,
              to: Number(to),
              amount: Number(amount),
            },
          })

          const event = await req.payload.findByID({
            collection: 'events',
            id: Number(eventId),
          })

          const newEvent = await req.payload.update({
            collection: 'events',
            id: Number(eventId),
            data: {
              amount: Number(event.amount) + Number(amount),
              actions: [...(event.actions || []), newAction.id],
            },
          })

          if (!event) {
            return Response.json({ message: 'Событие не найдено' }, { status: 404 })
          }

          return Response.json('success')
        } catch (error) {
          return Response.json(
            { message: 'Произошла ошибка при получении события' },
            { status: 500 },
          )
        }
      },
    },
    {
      path: '/remove-action',
      method: 'post',
      handler: async (req) => {
        if (!req.user) {
          return Response.json({ message: 'Пожалуйста, войдите в систему' }, { status: 401 })
        }

        try {
          const data = await req.json()
          console.log(data)
          const { eventId, actionId } = data

          if (!eventId || !actionId) {
            return Response.json({ message: 'ID события или действия не указан' }, { status: 400 })
          }

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

          await req.payload.delete({
            collection: 'actions',
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

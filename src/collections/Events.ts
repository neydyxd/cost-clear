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
  ],
  endpoints: [
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
        const data = await req.json()
        const { eventId } = data
        const event = await req.payload.findByID({
          collection: 'events',
          id: eventId,
        })
        return Response.json(event)
      },
    },
  ],
}

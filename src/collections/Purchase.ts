import type { CollectionConfig } from 'payload'

export const Purchase: CollectionConfig = {
  slug: 'purchase',

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
    },
  ],
  endpoints: [
    {
      path: '/add-purchase',
      method: 'post',
      handler: async (req) => {
        if (!req.json) {
          return Response.json({ message: 'Неверный формат запроса' }, { status: 400 })
        }
        const { name, amount, date, eventId } = await req.json()
        const user = req.user
        if (!user) {
          return Response.json({ message: 'Пользователь не авторизован' }, { status: 401 })
        }
        const purchase = await req.payload.create({
          collection: 'purchase',
          data: { name, amount, user: user.id, date },
        })

        const event = await req.payload.findByID({
          collection: 'events',
          id: Number(eventId),
        })

        if (!event) {
          return Response.json({ message: 'Событие не найдено' }, { status: 404 })
        }

        const updatedEvent = await req.payload.update({
          collection: 'events',
          id: Number(eventId),
          data: {
            purchases: [...(event.purchases || []), purchase.id],
          },
        })
        return Response.json({ purchase, updatedEvent })
      },
    },
  ],
}

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
      name: 'from',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'to',
      type: 'relationship',
      relationTo: 'users',
    },
  ],
  endpoints: [
  ],
}

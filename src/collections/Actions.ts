import { CollectionConfig } from "payload";

export const Actions: CollectionConfig = {
    slug: 'actions',
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
        required: true,
      },
      {
        name: 'depts',
        type: 'relationship',
        relationTo: 'purchase',
        hasMany: true,
      },
    ],
  }
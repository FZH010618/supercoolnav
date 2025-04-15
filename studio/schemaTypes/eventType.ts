import {defineField, defineType} from 'sanity'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
    }),
    defineField({
      name: 'eventType',
      type: 'string',
    }),    
    defineField({
      name: 'date',
      type: 'datetime',
    }),
    defineField({
      name: 'doorsOpen',
      type: 'number',
    }),
    defineField({
      name: 'venue',
      type: 'reference',
      to: [{type: 'venue'}],
    }),
    defineField({
      name: 'headline',
      type: 'reference',
      to: [{type: 'artist'}],
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'details',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'tickets',
      type: 'url',
    }),
  ],
})

// Replace "slug" in the array of fields:
defineField({
  name: 'slug',
  type: 'slug',
  options: {source: 'name'},
}),


  // Replace "eventType" in the array of fields:
defineField({
  name: 'eventType',
  type: 'string',
  options: {
    list: ['in-person', 'virtual'],
    layout: 'radio',
  },
}),

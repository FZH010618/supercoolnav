import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'listing',
  title: '资源项',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '标题',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: '标识符（Slug）',
      type: 'slug',
      options: { source: 'title', maxLength: 96 }
    }),
    defineField({
      name: 'url',
      title: '网址',
      type: 'url'
    }),
    defineField({
      name: 'description',
      title: '描述',
      type: 'text'
    }),
    defineField({
      name: 'group',
      title: '所属分组',
      type: 'reference',
      to: [{ type: 'group' }]
    })
  ]
})
 

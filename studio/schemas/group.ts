import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'group',
  title: '分组',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '名称',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: '标识符（Slug）',
      type: 'slug',
      options: { source: 'name', maxLength: 96 }
    }),
    defineField({
      name: 'description',
      title: '描述',
      type: 'text'
    }),
    defineField({
      name: 'cover',
      title: '封面图',
      type: 'image'
    })
  ]
})


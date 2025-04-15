import { defineType, defineField } from 'sanity';

export const event = defineType({
  name: 'event',
  title: '事件',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '标题',
      type: 'string',
      validation: Rule => Rule.required().min(3).max(100),
    }),
    defineField({
      name: 'slug',
      title: '标识符 (Slug)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: '简介',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'startTime',
      title: '开始时间',
      type: 'datetime',
    }),
    defineField({
      name: 'endTime',
      title: '结束时间',
      type: 'datetime',
    }),
    defineField({
      name: 'location',
      title: '地点',
      type: 'string',
    }),
    defineField({
      name: 'cover',
      title: '封面图',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'isPublic',
      title: '是否公开',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'createdAt',
      title: '创建时间',
      type: 'datetime',
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'cover',
      subtitle: 'location',
    },
  },
});

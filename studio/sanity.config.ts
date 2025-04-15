import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas' // ← 修正路径

export default defineConfig({
  name: 'default',
  title: 'CMS',

  projectId: 'your_project_id', // ← 替换为你的实际 ID
  dataset: 'production',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})

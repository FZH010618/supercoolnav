import studio from '@sanity/eslint-config-studio'

export default [...studio]
import { defineConfig } from 'sanity'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'default',
  title: '我的目录CMS',
  projectId: 'k42zczmk',
  dataset: 'production',
  basePath: '/studio',
  schema: {
    types: schemaTypes
  }
})

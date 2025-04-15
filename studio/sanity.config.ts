// studio/sanity.config.ts
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes'; // 👈 注意引入这个

export default defineConfig({
  name: 'default',
  title: 'CMS',

  projectId: 'your_project_id',
  dataset: 'production',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
});

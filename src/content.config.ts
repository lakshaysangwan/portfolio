import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    role: z.string(),
    timeframe: z.string(),
    stack: z.array(z.string()),
    teamSize: z.number(),
    category: z.enum(['product', 'infra', 'security', 'architecture', 'feature']),
    impact: z.string(),
    featured: z.boolean(),
    draft: z.boolean(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    stack: z.array(z.string()),
    status: z.enum(['live', 'wip', 'archived']),
    liveUrl: z.string().url().nullable(),
    codeUrl: z.string().url().nullable(),
    featured: z.boolean(),
    draft: z.boolean(),
  }),
});

export const collections = { work, projects };

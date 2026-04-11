# lakshay.dev — Portfolio

Personal portfolio and case study site for Lakshay Sangwan.

**Stack:** Astro 6 · Tailwind CSS v4 · MDX Content Collections · Cloudflare Pages

## Dev

```bash
npm install
npm run dev       # localhost:4321
npm run build     # production build → dist/
npm run preview   # serve dist/ locally
```

## Content

- Case studies → `src/content/work/*.mdx`
- Side projects → `src/content/projects/*.mdx`
- About page → `src/pages/about.astro`
- Resume → `public/resume.pdf`

## Deploy

Hosted on Cloudflare Pages. Push to `main` triggers a build automatically.

Build command: `npm run build`  
Output directory: `dist`

Set `PUBLIC_CF_ANALYTICS_TOKEN` in Cloudflare Pages environment variables after first deploy.

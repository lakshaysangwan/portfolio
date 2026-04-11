import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Satori requires TTF/OTF — fonts in public/og-fonts/ which copies to dist/og-fonts/
// During prerender, chunks are in dist/.prerender/chunks/ so ../../og-fonts/ → dist/og-fonts/
const interBold = readFileSync(
  path.resolve(__dirname, '../../og-fonts/inter-600.ttf')
);
const interRegular = readFileSync(
  path.resolve(__dirname, '../../og-fonts/inter-400.ttf')
);

export const getStaticPaths: GetStaticPaths = async () => {
  const workEntries = await getCollection('work', (e) => !e.data.draft);
  const projectEntries = await getCollection('projects', (e) => !e.data.draft);

  const paths = [
    // Default OG image
    { params: { slug: 'default' }, props: { title: 'Lakshay Sangwan', subtitle: 'Product Engineer · Java · Spring Boot · AWS' } },
    // Work entries
    ...workEntries.map((e) => ({
      params: { slug: `work-${e.id}` },
      props: { title: e.data.title, subtitle: e.data.impact },
    })),
    // Project entries
    ...projectEntries.map((e) => ({
      params: { slug: `projects-${e.id}` },
      props: { title: e.data.name, subtitle: e.data.tagline },
    })),
  ];

  return paths;
};

export const GET: APIRoute = async ({ props }) => {
  const { title, subtitle } = props as { title: string; subtitle: string };

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '60px',
          backgroundColor: '#0c0a09',
          fontFamily: 'Inter',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                width: '48px',
                height: '4px',
                backgroundColor: '#2dd4bf',
                marginBottom: '32px',
                borderRadius: '2px',
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '52px',
                fontWeight: '600',
                color: '#fafaf9',
                lineHeight: '1.2',
                marginBottom: '16px',
                maxWidth: '900px',
              },
              children: title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '26px',
                fontWeight: '400',
                color: '#a8a29e',
                maxWidth: '800px',
              },
              children: subtitle,
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
        { name: 'Inter', data: interBold, weight: 600, style: 'normal' },
      ],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png = resvg.render().asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};

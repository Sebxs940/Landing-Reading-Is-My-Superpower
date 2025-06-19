// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import express from '@astrojs/express';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: express(),
  vite: {
    plugins: [tailwindcss()]
  }
});
import { defineConfig } from '@rsbuild/core';
import { pluginPreact } from '@rsbuild/plugin-preact';
import { pluginTailwindcss } from '@rsbuild/plugin-tailwindcss';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [pluginPreact(), pluginTailwindcss()],
  html: {
    title: 'Trayectoria de ascenso — Método de Euler',
    meta: {
      description:
        'Simulación del despegue de un cohete con el método de Euler y comparación con la solución analítica. Métodos Numéricos, misión espacial 1962.',
    },
  },
});

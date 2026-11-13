# Trayectoria de ascenso — Método de Euler

Aplicación web que simula el despegue de un cohete experimental durante los primeros 20 segundos mediante el **método de Euler** y compara los resultados con la **solución analítica** de la ecuación diferencial.

Inspirada en el desafío de Métodos Numéricos sobre la misión Friendship 7 de 1962 y la película *Talentos ocultos*.

**Demo:** https://euler.alfonsofichas.workers.dev

## Qué incluye

- Modelo de ascenso vertical: `dv/dt = T/m − g − (k/m)v`, `dy/dt = v`.
- Panel editable con masa, empuje, gravedad, resistencia, condiciones iniciales, tiempo final y paso.
- Presets de paso de Euler: 2, 1, 0.5 y 0.25 s.
- Tabla de iteraciones con tiempo, velocidad y altura.
- Solución analítica de velocidad y altura, derivada por separación de variables.
- Gráficas comparativas Euler vs. analítica.
- Tabla de error absoluto para cada paso y su convergencia.
- Fórmulas renderizadas con KaTeX.

## Tecnologías

- [Preact](https://preactjs.com/) + TypeScript
- [Rsbuild](https://rsbuild.rs/) + Tailwind CSS
- [KaTeX](https://katex.org/)
- Tests con [Rstest](https://rstest.rs/)
- Despliegue en Cloudflare Workers (assets estáticos) con Wrangler

## Desarrollo

Instala las dependencias:

```bash
bun install
```

Inicia el servidor de desarrollo en [http://localhost:3000](http://localhost:3000):

```bash
bun run dev
```

## Tests y calidad

```bash
bun run test
bun run lint
```

## Build y despliegue

Genera la versión de producción en `dist/`:

```bash
bun run build
```

Despliega en Cloudflare Workers:

```bash
bun run deploy
```

La configuración vive en `wrangler.jsonc` y sirve el contenido de `dist/` como assets estáticos con fallback a `index.html`.

## Resultados de referencia (h = 2 s)

| Magnitud | Euler | Analítica | Error absoluto |
| --- | --- | --- | --- |
| Velocidad a 20 s | 46,3273 m/s | 44,8761 m/s | 1,4512 m/s |
| Altura a 20 s | 574,7272 m | 589,2390 m | 14,5118 m |

Reduciendo el paso a 0,25 s, los errores bajan a 0,1763 m/s y 1,7633 m, muy por debajo de los umbrales del desafío.

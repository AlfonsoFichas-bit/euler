# Desafío de Métodos Numéricos: Misión espacial NASA 1962 — El método de Euler

Inspirado en la película Talentos ocultos (Hidden Figures) y en los cálculos que contribuyeron a llevar al ser humano a la Luna.

[Women remain trapped in corporate limbo](https://images.openai.com/static-rsc-4/6wc-G8qV99s8rHx89KUnHewWxpp9BX346XnQTYqNPOtgZatanJQ1D5d9ftsY0Gpjpl3ujxWd6Bgoswg1LeC3eEO6JgGoejXQXF6um1vpwbJdBrTm6S9r_87QlkVPLHnWjw2XxDXIFFxlOWdyfIMWxvjtW4rQeyBvknTz6MDaMPA?purpose=inline)

[The story behind the 'fireflies' that astronaut John Glenn saw in space](https://images.openai.com/static-rsc-4/8epoaDzNDmUw1nnwXf_O2u6c4pRIWvnckWReF94U4Ed50AM7O1ra-NyYWqFRK4GdKh1ycxW8wGKI8UjW6GjIcXXvXLMca5GuyHodHDyG32yt1pYHkZTapiw51WlcOkyH5HAFswFScPg6M4EawkUQPuf15b3gRcwbqkv8MsYtqzc?purpose=inline)

[Remembering Katherine Johnson. A space scientist's life in pictures](https://images.openai.com/static-rsc-4/YAp9hHCNm1EklEcsFIQgstdJYJc87-EGpmMU_-Xl3iVlHpBf2gLUh5XGoz2py6eQjzhmOz7060mtLJMZDRHe6Reqoh0kivwWnush23Ws8kzv5HBux3YvzxkBdrJLeG1fHrHl_ks5NU0kVKCxbnfhQgH21t08BG85Rmk8ZHYQGbc?purpose=inline)

4

## 1. Contexto histórico: ¿cómo utilizaban las matemáticas en la NASA?

La película a la que probablemente se refiere es Talentos ocultos (Hidden Figures), que relata el trabajo de las matemáticas Katherine Johnson, Dorothy Vaughan y Mary Jackson durante la carrera espacial de Estados Unidos.

En 1962, la NASA se preparaba para enviar a John Glenn a orbitar la Tierra en la misión Friendship 7. Uno de los mayores desafíos era calcular la trayectoria de la nave y determinar cómo regresaría de manera segura.

En la película se menciona el método de Euler para resolver ecuaciones diferenciales relacionadas con el movimiento de la cápsula espacial, especialmente su regreso a la Tierra. La referencia al método fue incorporada al guion con asesoramiento matemático. No debe interpretarse como que Euler fue el único procedimiento utilizado en la misión real.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://www.aip.org\&sz=32)

AIP+1



Katherine Johnson realizó cálculos de trayectorias y verificó resultados de computadoras electrónicas. Posteriormente contribuyó al programa Apolo, incluido el vuelo a la Luna de 1969.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://ciencia.nasa.gov\&sz=32)

NASA Ciencia+1



## 2. Planteamiento del desafío

## Misión: calcular el despegue de un cohete

Nivel intermedio

Año 1962. Formas parte del equipo de matemáticos de la NASA. Se realizará el lanzamiento experimental de un pequeño cohete y necesitas calcular su velocidad y altura durante los primeros 20 segundos.

Las computadoras son limitadas y tu misión consiste en aproximar los resultados utilizando el método de Euler, paso a paso, y contrastarlos con una solución analítica.

[Americans in Orbit: The Flight of John Glenn (Part 2) - AmericaSpace](https://images.openai.com/static-rsc-4/gxA2CTpGHoyzLbHw9fo16Qb7vS3rVYdkyApTVsipppH7TwTKYyUGC6M89c3aBGtNbLlkbVsMX8_xhBpwtSTibgPYJsbgaxweHTvzgcUqS2QmNE4wUFEhaT2jFI0CREZGjyFzPtC6PQ19X-5FCDMdHKolasDXsSyiUOm2Bsgnj3s?purpose=inline)

[americaspace.com](https://www.americaspace.com/2013/02/17/americans-in-orbit-the-flight-of-john-glenn-part-2/?utm_source=chatgpt.com)

### Datos del cohete experimental

Los siguientes valores son ficticios y se han elegido para que los estudiantes puedan resolver el ejercicio manualmente.

| Parámetro                         | Símbolo    | Valor     |
| --------------------------------- | ---------- | --------- |
| Masa del cohete                   | \\(m\\)    | 1.000 kg  |
| Empuje del motor                  | \\(T\\)    | 15.000 N  |
| Gravedad                          | \\(g\\)    | 9,81 m/s² |
| Coeficiente de resistencia lineal | \\(k\\)    | 100 kg/s  |
| Velocidad inicial                 | \\(v(0)\\) | 0 m/s     |
| Altura inicial                    | \\(y(0)\\) | 0 m       |
| Tiempo de simulación              | \\(t\\)    | 0 a 20 s  |
| Paso de Euler                     | \\(h\\)    | 2 s       |

### Preguntas que deberá resolver el estudiante

1. ¿Cuál será la velocidad del cohete después de 2, 4, 10 y 20 segundos?
2. ¿Qué altura alcanzará después de 20 segundos?
3. ¿Cuál es la solución analítica de la ecuación diferencial?
4. ¿Qué diferencias se presentan entre Euler y la solución exacta?
5. ¿Qué ocurre si reducimos el paso de 2 segundos a 1 segundo o 0,5 segundos?

## 3. Construcción del modelo matemático

Aplicamos la segunda ley de Newton:

\\[ F=ma \\]

Durante el ascenso intervienen tres fuerzas simplificadas:

Diagrama simplificado de fuerzas durante el ascenso.

- Empuje: \\(T\\), fuerza que impulsa el cohete hacia arriba.
- Peso: \\(mg\\), fuerza gravitacional dirigida hacia abajo.
- Resistencia: \\(kv\\), fuerza que se opone al movimiento ascendente.

La fuerza resultante es:

\\[ m\frac{dv}{dt}=T-mg-kv \\]

Dividimos entre la masa:

\\[ \frac{dv}{dt}=\frac{T}{m}-g-\frac{k}{m}v \\]

Sustituimos los datos:

\\[ \frac{dv}{dt}=\frac{15000}{1000}-9.81-\frac{100}{1000}v \\]

Simplificamos:

\\[ \boxed{\frac{dv}{dt}=5.19-0.1v} \\]

Y como la velocidad es la derivada de la altura:

\\[ \boxed{\frac{dy}{dt}=v} \\]

Tenemos el sistema de ecuaciones diferenciales:

\\[ \boxed{ \begin{aligned} v'&=5.19-0.1v\\\ y'&=v \end{aligned}} \\]

Con condiciones iniciales:

\\[ v(0)=0,\qquad y(0)=0 \\]

Nota física: Este es un modelo didáctico de ascenso vertical con masa, empuje, gravedad y resistencia constantes. Un cohete real consume combustible, cambia de masa y experimenta una resistencia aerodinámica mucho más compleja.

## 4. Resolución por el método de Euler

Usaremos la fórmula:

\\[ v\_{n+1}=v_n+h(5.19-0.1v_n) \\]

Y para la altura:

\\[ y\_{n+1}=y_n+hv_n \\]

Elegimos un paso:

\\[ h=2\text{ segundos} \\]

### Iteración 0: instante inicial

\\[ t_0=0,\quad v_0=0,\quad y_0=0 \\]

### Iteración 1: tiempo = 2 segundos

Cálculo de la velocidad:

\\[ v_1=0+2(5.19-0.1(0)) \\]

\\[ \boxed{v_1=10.38\text{ m/s}} \\]

Cálculo de la altura:

\\[ y_1=0+2(0) \\]

\\[ \boxed{y_1=0\text{ m}} \\]

La altura de Euler resulta cero al primer paso porque utiliza la velocidad inicial en todo el intervalo de aproximación. El cohete sí ha ascendido físicamente: se trata de un error de discretización.

### Iteración 2: tiempo = 4 segundos

Velocidad:

\\[ v_2=10.38+2(5.19-0.1(10.38)) \\]

\\[ v_2=10.38+2(4.152) \\]

\\[ \boxed{v_2=18.684\text{ m/s}} \\]

Altura:

\\[ y_2=0+2(10.38) \\]

\\[ \boxed{y_2=20.76\text{ m}} \\]

### Iteración 3: tiempo = 6 segundos

Velocidad:

\\[ v_3=18.684+2(5.19-0.1(18.684)) \\]

\\[ \boxed{v_3=25.3272\text{ m/s}} \\]

Altura:

\\[ y_3=20.76+2(18.684) \\]

\\[ \boxed{y_3=58.128\text{ m}} \\]

Continuamos utilizando los resultados del paso anterior hasta alcanzar los 20 segundos.

## 5. Tabla completa de Euler

| Tiempo (s) | Velocidad (m/s) | Altura (m) |
| ---------- | --------------- | ---------- |
| 0          | 0,0000          | 0,0000     |
| 2          | 10,3800         | 0,0000     |
| 4          | 18,6840         | 20,7600    |
| 6          | 25,3272         | 58,1280    |
| 8          | 30,6418         | 108,7824   |
| 10         | 34,8934         | 170,0659   |
| 12         | 38,2947         | 239,8527   |
| 14         | 41,0158         | 316,4422   |
| 16         | 43,1926         | 398,4738   |
| 18         | 44,9341         | 484,8590   |
| 20         | 46,3273         | 574,7272   |

Resultados de Euler al completar la simulación

Velocidad a los 20 s

# 46,3273

m/s

Altura a los 20 s

# 574,7272

metros

## 6. Solución analítica del lanzamiento

Partimos de la ecuación diferencial:

\\[ \frac{dv}{dt}=5.19-0.1v \\]

La resolveremos utilizando separación de variables.

### Paso 1. Separar las variables

\\[ \frac{dv}{5.19-0.1v}=dt \\]

### Paso 2. Integrar

\\[ \int\frac{dv}{5.19-0.1v}=\int dt \\]

Al integrar:

\\[ -10\ln|5.19-0.1v|=t+C \\]

Dividimos entre \\(-10\\):

\\[ \ln|5.19-0.1v|=-0.1t+C_1 \\]

Aplicamos la función exponencial:

\\[ 5.19-0.1v=Ce^{-0.1t} \\]

### Paso 3. Despejar la velocidad

\\[ v(t)=51.9-10Ce^{-0.1t} \\]

Aplicamos la condición inicial \\(v(0)=0\\):

\\[ 0=51.9-10C \\]

\\[ C=5.19 \\]

La solución analítica de la velocidad es:

\\[ \boxed{v(t)=51.9(1-e^{-0.1t})} \\]

### Paso 4. Calcular la altura analítica

Sabemos que:

\\[ \frac{dy}{dt}=v(t) \\]

Por tanto:

\\[ y(t)=\int51.9(1-e^{-0.1t})\\,dt \\]

Integrando:

\\[ y(t)=51.9t+519e^{-0.1t}+C \\]

Aplicamos \\(y(0)=0\\):

\\[ 0=519+C \\]

\\[ C=-519 \\]

La solución analítica de la altura es:

\\[ \boxed{y(t)=51.9t-519(1-e^{-0.1t})} \\]

### Paso 5. Evaluar a los 20 segundos

Para la velocidad:

\\[ v(20)=51.9(1-e^{-2}) \\]

\\[ \boxed{v(20)=44.8761\text{ m/s}} \\]

Para la altura:

\\[ y(20)=51.9(20)-519(1-e^{-2}) \\]

\\[ \boxed{y(20)=589.2390\text{ m}} \\]

Estos resultados permiten comprobar la precisión de Euler.

## 7. Gráficas comparativas

## Velocidad del cohete

Solución de Euler con h = 2 segundos frente a la solución analítica.

EulerAnalítica

0 m/s15 m/s30 m/s45 m/s60 m/s02468101214161820

Euler sobreestima la velocidad durante el ascenso porque emplea la aceleración calculada al principio de cada intervalo.

## Altura del cohete

Comparación de la posición vertical del cohete durante los primeros 20 segundos.

EulerAnalítica

0 m200 m400 m600 m800 m02468101214161820

Euler subestima la altura porque utiliza la velocidad del inicio de cada intervalo para calcular el desplazamiento.

## 8. Evaluación del error numérico

El error absoluto se define como:

\\[ E_a=|\text{Valor exacto}-\text{Valor aproximado}| \\]

Para la velocidad a los 20 segundos:

\\[ E_v=|44.8761-46.3273| \\]

\\[ \boxed{E_v\approx1.4512\text{ m/s}} \\]

Para la altura:

\\[ E_y=|589.2390-574.7272| \\]

\\[ \boxed{E_y\approx14.5118\text{ m}} \\]

### ¿Qué sucede al reducir el paso de Euler?

| Paso \\(h\\) | Velocidad (m/s) | Error velocidad (m/s) | Altura (m) | Error altura (m) |
| ------------ | --------------- | --------------------- | ---------- | ---------------- |
| 2 s          | 46,3273         | 1,4512                | 574,7272   | 14,5118          |
| 1 s          | 45,5902         | 0,7141                | 582,0983   | 7,1407           |
| 0,5 s        | 45,2302         | 0,3541                | 585,6978   | 3,5412           |
| 0,25 s       | 45,0524         | 0,1763                | 587,4757   | 1,7633           |
| Exacta       | 44,8761         | 0                     | 589,2390   | 0                |

Observamos que disminuir el paso mejora la aproximación en este ejercicio.

## 9. Desafío interactivo: tú decides la precisión del lanzamiento

Imagina que eres responsable de comprobar los cálculos antes del despegue. Modifica el paso de Euler y observa si las aproximaciones cumplen los límites de error establecidos.

Selecciona el paso de integración

2 segundos (10 iteraciones)

1 segundo (20 iteraciones)

0,5 segundos (40 iteraciones)

0,25 segundos (80 iteraciones)

Velocidad calculada

# 46.3273

m/s a los 20 s

Altura calculada

# 574.7272

metros a los 20 s

Requisitos de precisión del desafío

Error de velocidad menor que 0,5 m/s

1.4512

Error de altura menor que 5 m

14.5118

La precisión todavía es insuficiente

Prueba un paso de integración menor para reducir los errores y cumplir ambos requisitos.

## 10. Actividad evaluativa para los estudiantes

Asignatura: Métodos Numéricos\
Tema: Método de Euler y ecuaciones diferenciales de primer orden\
Modalidad: Individual o equipos de hasta tres estudiantes\
Puntuación sugerida: 20 puntos

### Trabajo solicitado

Los estudiantes deberán desarrollar una aplicación web de simulación que reproduzca el despegue del cohete experimental.

La aplicación deberá permitir ingresar los parámetros del modelo, ejecutar el método de Euler, calcular la solución analítica y comparar los resultados mediante tablas y gráficas.

Como ampliación, podrán incorporar los métodos de Heun y Runge-Kutta de cuarto orden (RK4) y justificar cuál es el más preciso para el mismo tamaño de paso.

### Rúbrica de evaluación

| Criterio                                           | Puntos |
| -------------------------------------------------- | ------ |
| Formulación e interpretación del modelo matemático | 3      |
| Implementación correcta del método de Euler        | 4      |
| Solución analítica de velocidad y altura           | 3      |
| Tabla de iteraciones y comparación de errores      | 3      |
| Gráficas y simulación web funcional                | 3      |
| Interpretación física y conclusiones               | 2      |
| Presentación y explicación del trabajo             | 2      |
| Total                                              | 20     |

Entregables: enlace de la aplicación web, repositorio GitHub con código fuente, informe breve con desarrollo matemático y un video explicativo de máximo 2 minutos.

## 11. Preguntas de reflexión

Para conectar los resultados con la película, los estudiantes deberán responder:

1. ¿Por qué era importante verificar los cálculos antes de enviar astronautas al espacio?
2. ¿Qué riesgos existirían al utilizar un tamaño de paso demasiado grande?
3. ¿Por qué una aproximación puede parecer razonable y aun así acumular errores importantes?
4. ¿Qué variables reales del lanzamiento no fueron consideradas en nuestro modelo?
5. ¿Por qué el cálculo de una trayectoria lunar requiere un modelo mucho más complejo que el ascenso vertical de este ejercicio?

## 12. Conclusión del desafío resuelto

El modelo permite aproximar el movimiento del cohete mediante el método de Euler y comprobar el resultado con una solución analítica.

Con un paso de 2 segundos, Euler calcula una velocidad de 46,3273 m/s y una altura de 574,7272 m a los 20 segundos. La solución exacta proporciona 44,8761 m/s y 589,2390 m, respectivamente.

La diferencia demuestra que no basta con obtener un resultado numérico: también es necesario evaluar su error y determinar si tiene la precisión requerida.

La enseñanza central de la película es precisamente el valor de las matemáticas en la toma de decisiones críticas. El desafío permite trasladar esa idea al aula: convertir ecuaciones diferenciales en resultados verificables, interpretarlos físicamente y reconocer sus limitaciones.

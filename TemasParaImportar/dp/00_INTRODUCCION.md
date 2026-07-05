# 00. Introducción a Programación Dinámica

> *"DP es quizás la técnica de resolución de problemas más desafiante entre los cuatro paradigmas."*  
> — Steven Halim, CP4 §3.5

**Tabla de Contenidos**
- [Sección A: El problema motivante](#sección-a-el-problema-motivante)
- [Sección B: Por qué falla el enfoque ingenuo](#sección-b-por-qué-falla-el-enfoque-ingenuo)
- [Sección C: Los Dos Pilares de DP](#sección-c-los-dos-pilares-de-dp)
- [Sección D: La visión de alto nivel](#sección-d-la-visión-de-alto-nivel)
- [Sección E: DP como transformación de complejidad](#sección-e-dp-como-transformación-de-complejidad)
- [Sección F: Analogía mental para siempre recordar](#sección-f-analogía-mental-para-siempre-recordar)

---

## Sección A: El problema motivante

Imagina este problema: **¿cuántas monedas mínimas necesitas para dar cambio de $7 usando monedas de \{1, 3, 4, 5\}?**

Tu primer instinto: greedy — tomar la moneda más grande que quepa.

```
$7 → tomar 5 → quedan $2 → tomar 1 → tomar 1 → TOTAL: 3 monedas
```

Pero la respuesta óptima es:

```
$7 = 3 + 4 → TOTAL: 2 monedas
```

**Greedy falla.** ¿Por qué? Porque elegir lo mejor *localmente* no garantiza lo mejor *globalmente*.

La fuerza bruta prueba todas las combinaciones posibles. Para $V$ cents con $n$ tipos de monedas, esto es exponencial: $O(n^V)$ en el peor caso.

**DP lo resuelve en $O(nV)$ tiempo.** La clave: *memorizar subproblemas ya resueltos*.

---

## Sección B: Por qué falla el enfoque ingenuo

### El árbol de recursión de Fibonacci

Para entender el problema de base, considera Fibonacci:

```
fib(5)
├── fib(4)
│   ├── fib(3)
│   │   ├── fib(2) ← calculado aquí
│   │   └── fib(1)
│   └── fib(2) ← ¡RECALCULADO!
└── fib(3) ← ¡RECALCULADO!
    ├── fib(2) ← ¡RECALCULADO POR TERCERA VEZ!
    └── fib(1)
```

`fib(2)` se calcula 3 veces. `fib(3)` dos veces. Para `fib(50)`, `fib(2)` se calcularía **miles de millones de veces**.

**Solución**: calcular cada subproblema exactamente una vez y guardar el resultado.

### El árbol de recursión del Coin Change

Para `cambio(7)` con monedas `{1, 3, 4}`:

```
cambio(7)
├── 1 + cambio(6)
│   ├── 1 + cambio(5)
│   │   ├── 1 + cambio(4) ← aparece múltiples veces
│   │   ├── 1 + cambio(2)
│   │   └── 1 + cambio(1)
│   ├── 1 + cambio(3) ← aparece múltiples veces
│   └── 1 + cambio(2)
├── 1 + cambio(4) ← mismo subproblema
└── 1 + cambio(3) ← mismo subproblema
```

Hay solo $V+1 = 8$ subproblemas distintos, pero sin memoización se recalculan exponencialmente.

**La transformación DP**: en vez de $O(n^V)$ recursivo, hacemos $O(1)$ por subproblema × $O(V)$ subproblemas = $O(nV)$ total.

---

## Sección C: Los Dos Pilares de DP

Para que DP funcione correctamente, el problema DEBE cumplir ambas condiciones. Si falta una, DP puede dar respuesta incorrecta.

### Pilar 1: Subestructura Óptima

**Definición**: la solución óptima a un problema grande se puede construir usando soluciones óptimas a subproblemas más pequeños.

**Intuición formal** (Rascó, DP Handbook):

Si definimos $\delta(x, i)$ como la distancia óptima del estado inicial $x$ al estado $i$, entonces para cualquier estado intermedio $j$ en el camino óptimo:

$$\delta(x, j) = \delta(x, i) + w(i, j)$$

donde $w(i,j)$ es el costo de transición $i \to j$.

**Ejemplo que SÍ cumple**: Coin Change.
- Solución óptima para $7 = 4 + 3$.
- La parte $4$ se resuelve óptimamente (1 moneda), la parte $3$ también (1 moneda).
- **La solución global usa soluciones locales óptimas.**

**Ejemplo que NO cumple**: Camino más largo en grafo con ciclos.
- Si el camino más largo de A a C pasa por B, el sub-camino de A a B no necesariamente es el más largo de A a B.
- Aplicar DP aquí da resultado incorrecto.

**Contra-ejemplo clásico** (CP4 §3.5 — Wedding Shopping):

Greedy "elegir la prenda más cara que quepa" falla porque asume subestructura que no existe para esa estrategia local. DP sí funciona porque verifica todas las combinaciones y *garantiza* subestructura al construir desde subproblemas conocidos.

### Pilar 2: Solapamiento de Subproblemas

**Definición**: el mismo subproblema aparece múltiples veces en la recursión natural del problema.

**Diferencia clave con Divide & Conquer**:
- **Divide & Conquer** (Mergesort): cada subproblema es *único*. Ordenar la mitad izquierda es independiente de ordenar la mitad derecha. No hay solapamiento → no ganas nada con DP.
- **DP** (Fibonacci, Knapsack): subproblemas se repiten → calcularlos una vez ahorra trabajo exponencial.

**Cuantificación del solapamiento** (CP4 §3.5):

Para Wedding Shopping con 20 prendas y presupuesto 200:
- Sin DP: $20^{20} \approx 10^{26}$ operaciones (imposible)
- Con DP: $20 \times 201 = 4{,}020$ estados distintos × 20 opciones por estado = $80{,}400$ operaciones (trivial)

**La pregunta diagnóstica**: ¿hay estados que se repiten en la recursión? Si yes → DP.

---

## Sección D: La visión de alto nivel

DP se reduce a tres decisiones que DEBES tomar correctamente:

```
1. ESTADO: ¿Qué información representa un subproblema?
           dp[i] = "...algo significativo..."
           
2. TRANSICIÓN: ¿Cómo combino subproblemas pequeños para resolver uno más grande?
           dp[i] = f(dp[j], dp[k], ...)    donde j, k < i en algún sentido
           
3. CASO BASE: ¿Cuáles son los subproblemas triviales que puedo resolver directamente?
           dp[0] = 0, dp[base_case] = valor_conocido
```

**El arte de DP está en elegir el estado correcto.**

Un estado bien elegido:
- Contiene *exactamente* la información necesaria para resolver el subproblema
- No contiene información redundante (que infla la tabla innecesariamente)
- No omite información necesaria (que haría la solución incorrecta)

### Ejemplo: estado malo vs estado bueno

**Problema**: en una cuadrícula $n \times m$, contar caminos de (0,0) a (n-1,m-1) moviéndose solo derecha o abajo.

**Estado malo**: `dp[paso]` = número de caminos después de `paso` movimientos.
- ¿Por qué es malo? No sé en qué celda estoy. El mismo número de pasos puede llevar a celdas distintas.

**Estado bueno**: `dp[i][j]` = número de caminos para llegar a la celda (i, j).
- Contiene exactamente la info necesaria (posición actual).
- Transición clara: `dp[i][j] = dp[i-1][j] + dp[i][j-1]`

---

## Sección E: DP como transformación de complejidad

La magia de DP es esta transformación:

$$\text{Problema exponencial} \xrightarrow{\text{memoización}} \text{Problema polinomial}$$

**La fórmula**:

$$T_{\text{DP}} = M \times k$$

donde:
- $M$ = número de estados distintos
- $k$ = costo de calcular un estado (la transición)

**Ejemplos**:

| Problema | Estados $M$ | Costo $k$ | Total |
|----------|-------------|-----------|-------|
| Fibonacci | $O(n)$ | $O(1)$ | $O(n)$ |
| Coin Change | $O(V)$ | $O(n)$ | $O(nV)$ |
| 0-1 Knapsack | $O(nS)$ | $O(1)$ | $O(nS)$ |
| LIS | $O(n)$ | $O(n)$ | $O(n^2)$ |
| TSP Bitmask | $O(2^n \cdot n)$ | $O(n)$ | $O(2^n \cdot n^2)$ |

*(Fuente: CP4 §3.5 — Tabla 3.4)*

**Regla práctica para concursos**: si el número de estados es $\leq 10^7$ y el costo de transición es $O(1)$ o $O(\log n)$, DP es factible en tiempo.

---

## Sección F: Analogía mental para siempre recordar

**DP es como un profesor que nunca repite dos veces lo mismo.**

Imagina que estás resolviendo un problema enorme. La recursión ingenua es como un profesor que, cada vez que un alumno pregunta "¿cuánto es Fibonacci(10)?", hace los cálculos desde cero.

DP es como ese mismo profesor que:
1. La primera vez que alguien pregunta Fibonacci(10), lo calcula **una sola vez**.
2. **Escribe la respuesta en el pizarrón.**
3. Las siguientes veces que alguien pregunta, **señala el pizarrón**.

El pizarrón es la **tabla de memoización** (Top-Down) o la **tabla DP** (Bottom-Up).

**La transformación**:
- Sin DP: $O(2^n)$ preguntas, cada una respondida desde cero.
- Con DP: $O(n)$ preguntas únicas, el resto son lecturas del pizarrón en $O(1)$.

---

## Checklist de verificación

Antes de implementar DP, verifica:

- [ ] ¿El problema pide minimizar, maximizar o contar?
- [ ] ¿La solución bruta es exponencial o factorial?
- [ ] ¿Puedo identificar subproblemas que se repiten?
- [ ] ¿La solución óptima grande se construye con soluciones óptimas pequeñas?
- [ ] ¿Puedo definir un estado que capture la información necesaria?
- [ ] ¿Puedo escribir la transición en términos de ese estado?

Si respondo SÍ a todo: es DP. Si alguna es NO: investigar si falta algo en la definición del estado.

---

## Errores comunes en esta etapa

**Error: asumir DP sin verificar subestructura óptima**
- Síntoma: WA en casos que parecen correctos.
- Fix: probar a mano con casos pequeños que la solución DP da el óptimo.

**Error: no reconocer el solapamiento**
- Síntoma: implementas Divide & Conquer cuando DP era necesario (TLE).
- Fix: pregunta explícitamente "¿se repite algún subproblema?"

**Error: confundir DP con Greedy**
- Greedy: elige la mejor opción local, sin backtrack. Rápido pero puede ser incorrecto.
- DP: prueba TODAS las opciones, guarda lo mejor. Más lento pero garantiza óptimo.
- La diferencia: Greedy funciona cuando la "greedy property" se cumple. DP siempre funciona si hay subestructura óptima + solapamiento.

---

**Referencias cruzadas**
- Ver `01_RECETA_UNIVERSAL.md` para el protocolo paso a paso
- Ver `09_TOP_DOWN_vs_BOTTOM_UP.md` para elegir implementación
- Ver `10_ERRORES_CONCEPTUALES.md` para errores avanzados

*Fuentes: CP4 §3.5 · CPH Cap. 7 · Rascó Galván, Cap. 1-2*

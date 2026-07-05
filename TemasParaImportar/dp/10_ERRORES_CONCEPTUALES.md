# 10. Errores Conceptuales: Los 8 Errores que Destruyen Soluciones DP

> *"No digas que sabes DP si solo memorizas soluciones. Aprende a identificar los estados que representan subproblemas eficientemente."*  
> — CP4 §3.5.4

**Tabla de Contenidos**
- [Error 1: Confundir Greedy con DP](#error-1-confundir-greedy-con-dp)
- [Error 2: No reconocer el solapamiento de subproblemas](#error-2-no-reconocer-el-solapamiento-de-subproblemas)
- [Error 3: Definición incorrecta del estado](#error-3-definición-incorrecta-del-estado)
- [Error 4: Transición incompleta](#error-4-transición-incompleta)
- [Error 5: Inicialización incorrecta de casos base](#error-5-inicialización-incorrecta-de-casos-base)
- [Error 6: Overflow silencioso](#error-6-overflow-silencioso)
- [Error 7: Subestructura óptima violada](#error-7-subestructura-óptima-violada)
- [Error 8: Orden de loops incorrecto en Bottom-Up](#error-8-orden-de-loops-incorrecto-en-bottom-up)

---

## Error 1: Confundir Greedy con DP

### El error

Creer que "siempre que pide el mínimo/máximo, puedo usar Greedy".

### ¿Cuándo falla Greedy?

Greedy funciona cuando tienes la **greedy property**: la elección localmente óptima en cada paso conduce a la solución globalmente óptima. Esto es raramente demostrable en concursos sin un argumento sólido.

**Ejemplo clásico** (CP4 §3.5.1 — Wedding Shopping):
```
Budget = 12, prendas: {6,4,8}, {5,10}, {1,5,3,5}

Greedy (elegir más caro que quepa): 
  toma 8 (quedan 4) → solo puede comprar 1 de la prenda 2 (precio ≤ 4: solo {1,3}) 
  → toma 3 (queda 1) → solo puede comprar {1} → total = 12 ✓

Pero para otro input podría fallar completamente.
```

**Por qué DP garantiza el óptimo y Greedy no**:
- Greedy: elige una opción localmente y NO la reconsidera. Si la elección fue subóptima, el error se propaga.
- DP: prueba TODAS las opciones y guarda la mejor. Ninguna posibilidad óptima se ignora.

### El diagnóstico

**¿Puedes demostrar que la elección greedy es siempre segura?**
- Argumento de intercambio (exchange argument): "si la solución óptima no usa mi elección greedy, puedo intercambiarla y no empeorar"
- Matroid structure: la solución tiene estructura de matroid

Si no puedes demostrar esto con seguridad → usa DP.

---

## Error 2: No reconocer el solapamiento de subproblemas

### El error

Aplicar DP cuando los subproblemas son **independientes** (no se solapan), desperdiciando tiempo precalculando cosas innecesarias. O, al contrario, usar Divide & Conquer cuando los subproblemas sí se solapan (TLE).

### Cuándo NO hay solapamiento (Divide & Conquer es mejor)

- **Mergesort**: ordenar mitad izquierda es completamente independiente de ordenar mitad derecha. Sin solapamiento → DP no aporta nada.
- **Binary Search**: cada partición reduce el problema a la mitad. No se repiten particiones.
- **QuickSort**: mismo argumento.

### Cuándo SÍ hay solapamiento (DP es necesario)

- **Fibonacci**: `fib(n)` necesita `fib(n-1)` y `fib(n-2)`. Pero `fib(n-1)` también necesita `fib(n-2)` → `fib(n-2)` se solaparía sin memoización.
- **Coin Change**: `change(10)` llama a `change(5)`, pero `change(6)` también llama a `change(5)` → solapamiento.
- **Knapsack**: múltiples caminos en el árbol de recursión llegan al mismo estado `(id, remW)`.

### El diagnóstico

Escribe la recursión. ¿El mismo par de parámetros aparece en más de una rama del árbol de llamadas? Si SÍ → DP.

---

## Error 3: Definición incorrecta del estado

### El error más costoso

Un estado mal definido produce una solución incorrecta o ineficiente que es **muy difícil de depurar**, porque el código "parece correcto" pero da WA.

### Tipos de error en el estado

**Tipo A: Estado demasiado amplio** (incluye info redundante)
```
Problema: Knapsack 0/1
Estado malo: dp[i][w][número_de_ítems_tomados] 
  → el número de ítems no afecta el valor, solo ocupa espacio y tiempo extra

Estado bueno: dp[i][w]
  → (ítem actual, capacidad) es suficiente para decidir de forma óptima
```

**Tipo B: Estado demasiado estrecho** (falta info necesaria)
```
Problema: Conteo de caminos en una cuadrícula con obstáculos
Estado malo: dp[k] = número de caminos de longitud k
  → no sé en qué celda estoy con k pasos, así que no puedo filtrar obstáculos

Estado bueno: dp[y][x] = número de caminos que llegan a la celda (y,x)
  → con la posición actual, puedo verificar si es obstáculo y manejar límites
```

**Tipo C: Estado no captura la decisión relevante**
```
Problema: LIS
Estado malo: dp[longitud] = "último elemento de alguna LIS de longitud dada"
  → difícil de construir la transición

Estado bueno: dp[i] = longitud de la LIS que termina en el índice i
  → transición natural: para j < i con A[j] < A[i], extendo con A[i]
```

### El diagnóstico

**Pregunta clave**: ¿dado solo el estado, puedo determinar la solución óptima para el subproblema correspondiente, sin conocer el "pasado" del que llegué aquí?

Si la respuesta es NO → el estado es incompleto.

---

## Error 4: Transición incompleta

### El error

No enumerar TODAS las opciones en cada transición. La solución puede ser aquella opción que olvidaste considerar.

### Ejemplo

```cpp
// Coin Change con monedas {1, 3, 4}
// ERROR: solo considera la moneda 1
for (int v = 1; v <= V; v++) {
    dp[v] = 1 + dp[v-1];  // ← solo usa moneda de valor 1!
}

// CORRECTO: itera sobre TODAS las monedas
for (int v = 1; v <= V; v++) {
    for (int c : coins) {
        if (c <= v) dp[v] = min(dp[v], 1 + dp[v-c]);
    }
}
```

### Cómo evitarlo

Antes de codificar, escribe explícitamente: "Las opciones son: ____".

Para Knapsack: "las opciones son tomar el ítem O no tomarlo" (exactamente 2).
Para Coin Change: "las opciones son usar cada moneda $c_i$" (exactamente $n$).
Para LCS: "las opciones son: coinciden (incluir en LCS), o saltar $A[i]$, o saltar $B[j]$" (exactamente 3 casos).

Si no puedes escribir la lista completa de opciones, **no empieces a codificar**.

---

## Error 5: Inicialización incorrecta de casos base

### El error

Los casos base son los fundamentos sobre los que se construye TODA la solución DP. Un error en la inicialización se propaga a todos los estados derivados.

### Los errores más comunes

**Error A: No inicializar dp[0]**
```cpp
// Coin Change — ERROR: no inicializar dp[0]
fill(dp, dp + V + 1, INF);
// dp[0] sigue siendo INF!
// → dp[coin_value] = INF + 1 = overflow → resultados basura

// CORRECTO:
fill(dp, dp + V + 1, INF);
dp[0] = 0;  // ← obligatorio
```

**Error B: Inicializar con el valor incorrecto**
```cpp
// Edit Distance — ERROR: no inicializar la primera fila/columna
// dp[i][0] debería ser i (i borrados), dp[0][j] debería ser j (j insertados)
// Si no se inicializan, el loop principal no puede calcular dp[1][1] correctamente

// CORRECTO:
for (int i = 0; i <= m; i++) dp[i][0] = i;
for (int j = 0; j <= n; j++) dp[0][j] = j;
```

**Error C: Usar 0 como sentinel cuando 0 es un valor válido**
```cpp
// Si dp puede ser 0 pero usas 0 para indicar "no calculado"
// → no puedes distinguir "estado no calculado" de "estado con respuesta 0"
// FIX: usa -1 o un valor fuera del rango posible como sentinel
memset(memo, -1, sizeof memo);
```

### El diagnóstico

Antes de implementar, escribe los casos base explícitamente:
1. "El caso base más pequeño es ___"
2. "Su valor es ___ porque ___"
3. ¿Hay casos "imposibles" que necesito inicializar con INF/-INF?

---

## Error 6: Overflow silencioso

### El error

El resultado o los valores intermedios crecen más allá del rango de `int` o `long long`, produciendo resultados incorrectos **sin ningún error de compilación o runtime**.

### Cuándo ocurre

- **Conteo**: "¿cuántas formas de...?" crece exponencialmente con $n$.
- **Suma de valores**: si los valores son grandes y sumas muchos.
- **Multiplicaciones en costos**: $p[i] \times p[k] \times p[j]$ en Matrix Chain puede ser $500^3 = 1.25 \times 10^8$.
- **INF + 1**: si `INF = INT_MAX` e intentas `dp[v] = INF + 1`.

### Cómo prevenirlo

```cpp
// Usa long long cuando:
// - el resultado puede superar 2×10^9 (límite de int)
// - multiplicas dos valores de orden 10^5 (resultado ~10^10)
long long dp[MAXN];

// Usa módulo en conteo:
const long long MOD = 1e9 + 7;
dp[i] = (dp[j] + dp[k]) % MOD;

// Usa INF = 1e9 en lugar de INT_MAX para minimización:
const int INF = 1e9;  // safe: INF + INF = 2×10^9, que sí cabe en int
// INT_MAX + 1 = overflow!
```

---

## Error 7: Subestructura óptima violada

### El error

Aplicar DP a un problema donde la solución óptima del problema grande NO se construye a partir de soluciones óptimas a subproblemas más pequeños.

### Ejemplo clásico: camino más largo

En un grafo **sin ciclos** (DAG), el camino más corto entre dos nodos tiene subestructura óptima → DP funciona.

Pero el **camino más largo** en un grafo **con ciclos** no tiene subestructura óptima: el camino más largo de $A$ a $C$ pasando por $B$ no implica que el sub-camino de $A$ a $B$ sea el más largo de $A$ a $B$.

*(Rascó, DP Handbook §2.2)*

### Otro ejemplo: Maximum Subarray product vs sum

- Máxima suma de subarreglo → DP (Kadane) ✓ (la suma del subarreglo anterior óptimo + elemento actual es óptima)
- Máximo producto de subarreglo → requiere trackear el mínimo también (los negativos pueden volver positivos) → DP modificado

### El diagnóstico

Hipotéticamente: "Si la solución óptima de $[0..n]$ incluye a $n$ y usa el subproblema $[0..k]$, ¿necesariamente ese subproblema es resuelto óptimamente?"

Si la respuesta no es claramente SÍ → DP puede no funcionar, o necesitas un estado más rico.

---

## Error 8: Orden de loops incorrecto en Bottom-Up

### El error

En Bottom-Up, el orden de iteración determina qué estados están disponibles cuando los necesitas. Un orden incorrecto provoca que uses valores de la tabla que aún no fueron calculados correctamente.

### Los casos más peligrosos

**Knapsack 0/1**: procesar capacidad de izquierda a derecha permite reutilizar el mismo ítem (se convierte en Unbounded Knapsack).
```cpp
// ERROR (para 0/1):
for (int cap = w[i]; cap <= S; cap++)   // ← izquierda a derecha = ILIMITADA
    dp[cap] = max(dp[cap], v[i] + dp[cap-w[i]]);

// CORRECTO (para 0/1):
for (int cap = S; cap >= w[i]; cap--)   // ← derecha a izquierda = 0/1
    dp[cap] = max(dp[cap], v[i] + dp[cap-w[i]]);
```

**Interval DP**: procesar por `(i, j)` en lugar de por longitud puede usar estados no calculados.
```cpp
// ERROR:
for (int i = 0; i < n; i++)
    for (int j = i+1; j < n; j++)
        for (int k = i+1; k < j; k++)
            // dp[i][k] y dp[k+1][j] pueden no estar listos si len(i,k) > len(i,j)? 
            // (depende del problema concreto)

// SEGURO: iterar por longitud de intervalo
for (int len = 2; len <= n; len++)
    for (int i = 0; i + len <= n; i++)
        // dp[i][i+len-1] depende de intervalos de longitud < len → ya calculados
```

### El diagnóstico

Dibuja el grafo de dependencias: `dp[A]` depende de `dp[B]` si para calcular `dp[A]` necesitas `dp[B]`. El orden de iteración debe ser un **orden topológico** de este grafo.

---

## Resumen rápido

| Error | Síntoma | Fix |
|-------|---------|-----|
| Greedy en lugar de DP | WA en algunos casos, AC en otros | Usar DP, probar todas las opciones |
| No reconocer solapamiento | TLE al no memoizar | Identificar estados repetidos |
| Estado incorrecto | WA misterioso | Verificar que el estado determine el subproblema unívocamente |
| Transición incompleta | WA en casos donde la opción olvidada es óptima | Listar TODAS las opciones |
| Casos base incorrectos | WA en casos pequeños, propagación de error | Inicializar manualmente y verificar |
| Overflow | Resultados negativos o absurdamente grandes | `long long`, `INF = 1e9`, módulo |
| Subestructura violada | WA sistemático incluso con el código correcto | Revisar si el problema admite DP |
| Orden de loops | WA o resultados incorrectos que parecen random | Asegurar orden topológico |

---

**Referencias cruzadas**
- Ver `00_INTRODUCCION.md` para los fundamentos teóricos
- Ver `01_RECETA_UNIVERSAL.md` para el proceso sistemático
- Ver `11_CASOS_EDGE.md` para debugging práctico

*Fuentes: CP4 §3.5.4 · Rascó Galván §2.2*

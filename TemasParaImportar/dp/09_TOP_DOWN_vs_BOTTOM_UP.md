# 09. Top-Down vs Bottom-Up: Decisión Profunda

> *"Para la mayoría de los problemas DP, ambos estilos son igualmente buenos y la decisión es cuestión de preferencia. Sin embargo, para problemas más difíciles, uno puede ser mejor que el otro."*  
> — CP4 §3.5 (Tabla 3.2)

**Tabla de Contenidos**
- [Sección A: Top-Down — Recursión + Memoización](#sección-a-top-down--recursión--memoización)
- [Sección B: Bottom-Up — Tabulación Iterativa](#sección-b-bottom-up--tabulación-iterativa)
- [Sección C: Comparación profunda](#sección-c-comparación-profunda)
- [Sección D: Regla de decisión para concursos](#sección-d-regla-de-decisión-para-concursos)
- [Sección E: Implementaciones lado a lado](#sección-e-implementaciones-lado-a-lado)

---

## Sección A: Top-Down — Recursión + Memoización

### ¿Qué es exactamente?

Top-Down DP es **backtracking con memoria**. Partes del problema grande, recursivamente bajas a subproblemas más pequeños, y guardas los resultados para no recalcularlos.

**Rascó (DP Handbook §3.1) lo describe como**:
> "Backtracking con Almacenamiento. La única diferencia del Backtracking es que marca los estados ya visitados. Su concepto: 'Eventualmente tendré una respuesta, por lo que no importa cuándo la obtenga'. Atraviesa el DAG estilo DFS."

### Cómo funciona internamente

```
dp(problema_grande)
  ├── dp(subproblema_1)  ← calculado la primera vez
  │     ├── dp(sub_sub_1)
  │     └── dp(sub_sub_2)
  ├── dp(subproblema_2)  ← guardado en memo
  └── dp(subproblema_1)  ← ¡REUTILIZADO DESDE MEMO! O(1)
```

### Template de Top-Down

```cpp
// Dos variantes de implementación (CP4 §3.5.1):

// Variante A: con array de memo + check explícito
int memo[MAXN][MAXM];  // inicializado con -1

int dp(int i, int j) {
    // 1. Casos base
    if (i == 0) return 0;
    if (j < 0) return -INF;
    
    // 2. Revisar si ya fue calculado
    if (memo[i][j] != -1) return memo[i][j];
    
    // 3. Calcular (la lógica normal)
    int ans = /* ... */;
    
    // 4. Guardar y retornar
    return memo[i][j] = ans;
}

// En main():
memset(memo, -1, sizeof memo);
cout << dp(n, S);

// Variante B: con referencia (más idiomática en C++, CP4 estilo)
int dp(int i, int j) {
    if (i == 0) return 0;
    int &ans = memo[i][j];   // referencia al slot del memo
    if (ans != -1) return ans;
    // ... calcular ...
    return ans = resultado;  // guarda Y retorna en una línea
}
```

### Ventajas de Top-Down

**Ventaja 1: Naturalidad**
El código refleja la recursión matemática directamente. Si puedes escribir la recurrencia, puedes escribir el código. No necesitas pensar en el orden de los loops.

**Ventaja 2: Lazy evaluation (cómputo perezoso)**
Solo calcula los estados que realmente son alcanzados. Si el problema tiene un espacio de estados grande pero "disperso" (muchos estados nunca se visitan), Top-Down puede ser mucho más rápido.

```
Ejemplo: Knapsack con n=1000 ítems y S=10000
- Bottom-Up: visita TODOS los 10^7 estados, incluso los irrelevantes
- Top-Down: solo visita los estados alcanzables desde dp(0, S)
  Si los pesos son grandes (muchas combinaciones imposibles), Top-Down gana

(CP4 §3.5.c): "El Top-Down puede ser más rápido que Bottom-Up porque no todos
los estados son visitados."
```

**Ventaja 3: Manejo de estados complejos**
Cuando el estado es difícil de enumerar de forma iterativa (p.ej., estados en grafos), Top-Down simplifica la implementación.

### Desventajas de Top-Down

**Desventaja 1: Stack overflow**
La recursión tiene profundidad = longitud del camino más largo en el DAG de estados. Si esto es $> 10^4$ o $10^5$, puede provocar stack overflow.

```cpp
// En Linux/Mac el stack es ~1-8 MB. Con profundidad N=10^5 y cada frame ~100 bytes
// → 10^5 × 100 = 10MB → stack overflow!

// Solución: aumentar el stack (plataforma-específico) o usar Bottom-Up
// En Linux: ulimit -s unlimited
// En Windows: /F flag al compilar
```

**Desventaja 2: Overhead de llamadas a función**
Cada llamada recursiva tiene overhead (guardar registros, etc.). Para estados simples donde el costo de transición es $O(1)$, este overhead puede ser $2-5\times$ más lento que Bottom-Up.

**Desventaja 3: Cache-unfriendly**
Las llamadas recursivas acceden a memoria en orden impredecible. Bottom-Up con acceso secuencial es más amigable para la caché CPU.

---

## Sección B: Bottom-Up — Tabulación Iterativa

### ¿Qué es exactamente?

Bottom-Up DP es el **"DP natural"**, como lo llama Rascó. Calculas todos los subproblemas en orden, desde los más pequeños hacia los más grandes, usando loops iterativos.

**Rascó (DP Handbook §3.2)**:
> "El DP natural, fue como el DP tuvo origen. 'Si ya tengo los cimientos, puedo construir lo que quiera'. Atraviesa el DAG estilo BFS multi-origen."

### El principio del orden topológico

Bottom-Up requiere que cuando calculas `dp[i]`, todos los estados de los que depende ya estén calculados. Esto es el **orden topológico** del DAG de estados.

Para la mayoría de los problemas DP lineales, el orden es simplemente `i = 0, 1, 2, ..., n`. Para problemas de intervalo, es por longitud creciente del intervalo.

```cpp
// Template de Bottom-Up
int dp[MAXN][MAXM];

// 1. Inicialización (casos base)
memset(dp, 0, sizeof dp);  // o fill con INF, dependiendo del problema
dp[0][0] = valor_base;

// 2. Llenado en orden topológico
for (int i = 1; i <= n; i++) {
    for (int j = 0; j <= m; j++) {
        // Transición
        dp[i][j] = /* función de dp[i-1][...] */;
    }
}

// 3. Respuesta
cout << dp[n][m];
```

### El orden de llenado importa

**Ejemplo crítico: Interval DP** (ver `03_INTERVALOS.md`)

```cpp
// INCORRECTO: dp[i][j] usa dp[i][k] y dp[k+1][j] donde (k-i) < (j-i)
// Si iteramos por i y j normalmente, dp[i][k] puede no estar calculado todavía

// CORRECTO: iterar por LONGITUD DEL INTERVALO
for (int len = 2; len <= n; len++) {          // longitud creciente
    for (int i = 0; i + len - 1 < n; i++) {  // inicio del intervalo
        int j = i + len - 1;                  // fin del intervalo
        for (int k = i; k < j; k++) {         // punto de división
            dp[i][j] = min(dp[i][j], dp[i][k] + dp[k+1][j] + costo);
        }
    }
}
```

### Ventajas de Bottom-Up

**Ventaja 1: Sin overhead de recursión**
Loops iterativos son los más rápidos en C++. Sin llamadas a función, sin stack frames adicionales.

**Ventaja 2: Sin riesgo de stack overflow**
No importa cuán profundo sea el DAG.

**Ventaja 3: Optimización de espacio (Space Saving)**
Solo necesitas guardar lo que aún es necesario para calcular el estado actual.

```cpp
// Knapsack: en vez de O(n×S), usa O(S)
// Posible porque dp[i][cap] solo depende de dp[i-1][*]
// → guarda solo la fila anterior (o actualiza in-place con el truco del loop invertido)
```

**Ventaja 4: Cache-friendly**
El acceso secuencial a la tabla DP es amigable para la caché CPU, lo que puede dar un speedup significativo.

### Desventajas de Bottom-Up

**Desventaja 1: Calcula TODO**
Bottom-Up visita todos los estados, incluso los inalcanzables. Si el problema tiene estados dispersos, desperdicia tiempo.

**Desventaja 2: Orden de loops no trivial**
Para problemas con dependencias complejas (Interval DP, algunos tree DP), determinar el orden correcto requiere más análisis.

**Desventaja 3: Menos intuitivo para algunos problemas**
Si la recurrencia es más natural como función recursiva, forzarla a Bottom-Up puede resultar en código confuso.

---

## Sección C: Comparación profunda

*(Basada en CP4 §3.5 Tabla 3.2)*

| Aspecto | Top-Down | Bottom-Up |
|---------|----------|-----------|
| **Estilo** | Recursivo + Memoización | Iterativo + Tabla |
| **Velocidad** | Más lento por overhead de función | Más rápido (sin overhead) |
| **Stack** | Riesgo de overflow si profundidad > ~10^5 | Sin riesgo |
| **Memoria** | $O(M)$ tabla + stack | $O(M)$ tabla, sin stack |
| **Estados calculados** | Solo los alcanzables (lazy) | Todos los estados |
| **Orden de cómputo** | Implícito (recursión lo maneja) | Explícito (debes definirlo) |
| **Cache** | Desordenado, menos eficiente | Secuencial, más eficiente |
| **Optim. espacio** | Difícil (recursión no lo permite fácilmente) | Fácil (guarda solo lo necesario) |
| **Naturalidad** | Alta para muchos problemas | Puede ser menos intuitivo |
| **Debugging** | Más fácil (trace del call stack) | Más difícil (tabla puede ser grande) |

---

## Sección D: Regla de decisión para concursos

```
¿El espacio de estados es DENSO (casi todos los estados son alcanzados)?
  → Bottom-Up. Más rápido, sin overhead.

¿El espacio de estados es DISPERSO (muchos estados inalcanzables)?
  → Top-Down. Calcula solo lo necesario.

¿La profundidad de recursión puede superar 10^4 - 10^5?
  → Bottom-Up (o iterar manualmente).

¿El problema tiene dependencias complejas difíciles de ordenar?
  → Top-Down más simple.

¿Necesitas optimización de espacio?
  → Bottom-Up.

¿Solo tienes 30 minutos y el problema es nuevo para ti?
  → Top-Down primero. Más fácil de implementar correctamente.
  → Si da TLE, analiza si puedes pasar a Bottom-Up.
```

### Regla de oro para ICPC

> **Implementa Top-Down cuando estés resolviendo el problema por primera vez. Cambia a Bottom-Up si hay TLE o MLE.**

La razón: Top-Down es más fácil de implementar correctamente bajo presión. La transición a Bottom-Up es mecánica una vez que tienes la recurrencia correcta.

---

## Sección E: Implementaciones lado a lado

### Fibonacci

```cpp
// TOP-DOWN
int memo[MAXN];
int fib_td(int n) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    return memo[n] = fib_td(n-1) + fib_td(n-2);
}
// Ventaja: código muy claro
// Desventaja: stack puede romperse para n > ~10^4

// BOTTOM-UP
int fib_bu(int n) {
    int dp[MAXN];
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}
// Ventaja: rápido, sin stack overflow
// Con optimización de espacio: O(1) memoria (solo 2 variables)

// BOTTOM-UP con O(1) espacio
int fib_opt(int n) {
    int a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        int c = a + b;
        a = b; b = c;
    }
    return b;
}
```

### Knapsack 0/1

```cpp
const int MAXN = 1005, MAXS = 10005;
int n, S, v[MAXN], w[MAXN];

// TOP-DOWN
int memo[MAXN][MAXS];
int knap_td(int id, int rem) {
    if (id == n || rem == 0) return 0;
    int &ans = memo[id][rem];
    if (ans != -1) return ans;
    if (w[id] > rem) return ans = knap_td(id+1, rem);
    return ans = max(knap_td(id+1, rem), v[id] + knap_td(id+1, rem-w[id]));
}
// Usar: memset(memo,-1,sizeof memo); knap_td(0, S);

// BOTTOM-UP 2D
int dp2[MAXN][MAXS];
int knap_bu2() {
    for (int i = 1; i <= n; i++)
        for (int c = 0; c <= S; c++) {
            dp2[i][c] = dp2[i-1][c];
            if (w[i-1] <= c)
                dp2[i][c] = max(dp2[i][c], v[i-1] + dp2[i-1][c-w[i-1]]);
        }
    return dp2[n][S];
}

// BOTTOM-UP 1D optimizado
int dp1[MAXS];
int knap_bu1() {
    fill(dp1, dp1+S+1, 0);
    for (int i = 0; i < n; i++)
        for (int c = S; c >= w[i]; c--)   // ← DERECHA a IZQUIERDA
            dp1[c] = max(dp1[c], v[i] + dp1[c-w[i]]);
    return dp1[S];
}
```

### Coin Change

```cpp
// TOP-DOWN
int memo[MAXV];
int coins[MAXN]; int n, V;
int change_td(int val) {
    if (val == 0) return 0;
    if (val < 0) return INF;
    if (memo[val] != -1) return memo[val];
    int ans = INF;
    for (int i = 0; i < n; i++)
        if (coins[i] <= val)
            ans = min(ans, 1 + change_td(val - coins[i]));
    return memo[val] = ans;
}

// BOTTOM-UP (preferido para este problema por densidad de estados)
int dp_cc[MAXV];
int coin_bu() {
    fill(dp_cc, dp_cc+V+1, INF);
    dp_cc[0] = 0;
    for (int v = 1; v <= V; v++)
        for (int i = 0; i < n; i++)
            if (coins[i] <= v && dp_cc[v-coins[i]] != INF)
                dp_cc[v] = min(dp_cc[v], 1 + dp_cc[v-coins[i]]);
    return dp_cc[V];
}
// Bottom-Up es mejor aquí: todos los estados v=0..V son alcanzables → denso
```

---

## Errores comunes al elegir

**Error: usar Top-Down cuando la profundidad es enorme**
```
Síntoma: Segmentation fault o "stack overflow" en casos grandes
Fix: Cambiar a Bottom-Up o aumentar el límite del stack
```

**Error: usar Bottom-Up con orden de loops incorrecto**
```
Síntoma: WA en casi todos los casos
Fix: Dibuja las dependencias dp[i] → dp[j] y asegúrate que j se calcula antes que i
```

**Error: inicializar memo con 0 en problemas donde 0 es un valor válido**
```cpp
// MAL: si dp[i][j] puede ser 0, no puedes usar 0 como "no calculado"
int memo[N][M] = {0};  // 0 = no calculado O 0 = valor calculado? Ambiguo!

// BIEN: usa -1 como sentinel (memset con -1 funciona para arrays de int)
memset(memo, -1, sizeof memo);  // todos los bytes en FF = -1 como int signed
// Excepciones: si dp puede ser negativo, usa otro sentinel (ej: INT_MIN/2)
```

---

**Referencias cruzadas**
- Ver `00_INTRODUCCION.md` para fundamentos
- Ver `01_RECETA_UNIVERSAL.md` para el Paso 5 de la receta
- Ver `02_MOCHILA.md` para ejemplo concreto de ambos estilos

*Fuentes: CP4 §3.5 Tabla 3.2 · Rascó Galván §3.1–3.2*

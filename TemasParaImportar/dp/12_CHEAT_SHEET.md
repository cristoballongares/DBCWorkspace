# 12. Cheat Sheet — Referencia Rápida para Concurso

> Lleva esto al concurso. Léelo en los 5 minutos antes de que comience.

---

## Árbol de decisión rápida

```
¿El problema pide min/max/contar?
  ├── SÍ → ¿La solución bruta es exponencial?
  │         ├── SÍ → ¿Subproblemas se repiten?
  │         │         ├── SÍ → ES DP ✓
  │         │         └── NO → Divide & Conquer
  │         └── NO → Greedy o formulación directa
  └── NO → Probablemente búsqueda / grafos

¿Qué tipo de DP?
  ├── "subconjunto de ítems, capacidad" → MOCHILA
  ├── "dos strings, subsecuencia/edición" → LCS / EDIT DISTANCE
  ├── "secuencia creciente más larga" → LIS
  ├── "caminos en cuadrícula/conteo" → GRID DP
  ├── "particionar array óptimamente" → INTERVAL DP
  ├── "selección en árbol" → TREE DP
  ├── "visitar todos con mínimo costo" → BITMASK DP (TSP)
  └── "¿existe subconjunto con suma S?" → SUBSET SUM
```

---

## Tabla de patrones

| Patrón | Estado | Transición | Complejidad | Orden loop |
|--------|--------|-----------|-------------|------------|
| **Coin Change** | `dp[v]` = min monedas | `dp[v] = min(dp[v-c]+1)` | $O(nV)$ | izq→der |
| **Knapsack 0/1** | `dp[w]` = max valor | `dp[w] = max(dp[w], v+dp[w-wi])` | $O(nW)$ | **der→izq** |
| **Knapsack ∞** | `dp[w]` = max valor | `dp[w] = max(dp[w], v+dp[w-wi])` | $O(nW)$ | izq→der |
| **LIS O(n²)** | `dp[i]` = LIS term. en i | `dp[i]=max(dp[j]+1) ∀j<i,A[j]<A[i]` | $O(n^2)$ | — |
| **LIS O(n log n)** | Array `L` ordenado | `lower_bound` + replace/push | $O(n \log n)$ | — |
| **LCS** | `dp[i][j]` = LCS prefijos | si igual: `dp[i-1][j-1]+1`, si no: `max(dp[i-1][j],dp[i][j-1])` | $O(mn)$ | — |
| **Edit Dist** | `dp[i][j]` = ediciones | `min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+cost)` | $O(mn)$ | — |
| **Grid paths** | `dp[y][x]` = suma/conteo | `max(dp[y-1][x],dp[y][x-1])+val` | $O(n^2)$ | — |
| **Interval DP** | `dp[i][j]` = costo [i,j] | `min(dp[i][k]+dp[k+1][j]+cost)` | $O(n^3)$ | por longitud |
| **Subset Sum** | `dp[s]` = bool/count | `dp[s] |= dp[s-A[k]]` | $O(nS)$ | **der→izq** |
| **TSP Bitmask** | `dp[u][mask]` = dist | `min(dp[v][mask^v]+dist[u][v])` | $O(2^n n^2)$ | — |

---

## Snippets listos para copiar

### Coin Change (mínimas monedas)
```cpp
const int INF = 1e9;
vector<int> dp(V+1, INF);
dp[0] = 0;
for (int v = 1; v <= V; v++)
    for (int c : coins)
        if (c <= v && dp[v-c] < INF)
            dp[v] = min(dp[v], 1 + dp[v-c]);
// Respuesta: dp[V] (o "imposible" si INF)
```

### Knapsack 0/1 (espacio O(W))
```cpp
vector<int> dp(S+1, 0);
for (int i = 0; i < n; i++)
    for (int cap = S; cap >= w[i]; cap--)  // ← DERECHA A IZQUIERDA
        dp[cap] = max(dp[cap], v[i] + dp[cap-w[i]]);
// Respuesta: dp[S]
```

### LIS O(n log n)
```cpp
vector<int> L;
for (int x : A) {
    auto it = lower_bound(L.begin(), L.end(), x);  // strict: lower_bound
    if (it == L.end()) L.push_back(x);
    else *it = x;
}
// Respuesta: L.size()
// Nota: usar upper_bound para no-decreciente
```

### LCS
```cpp
vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
for (int i = 1; i <= m; i++)
    for (int j = 1; j <= n; j++)
        dp[i][j] = (A[i-1]==B[j-1]) ? dp[i-1][j-1]+1 
                                     : max(dp[i-1][j], dp[i][j-1]);
// Respuesta: dp[m][n]
```

### Edit Distance
```cpp
vector<vector<int>> dp(m+1, vector<int>(n+1));
for (int i = 0; i <= m; i++) dp[i][0] = i;
for (int j = 0; j <= n; j++) dp[0][j] = j;
for (int i = 1; i <= m; i++)
    for (int j = 1; j <= n; j++)
        dp[i][j] = (A[i-1]==B[j-1]) ? dp[i-1][j-1]
                   : 1+min({dp[i-1][j-1], dp[i-1][j], dp[i][j-1]});
// Respuesta: dp[m][n]
```

### Subset Sum (decisión)
```cpp
vector<bool> dp(S+1, false);
dp[0] = true;
for (int x : A)
    for (int s = S; s >= x; s--)  // ← DERECHA A IZQUIERDA
        dp[s] = dp[s] || dp[s-x];
// Respuesta: dp[S]
```

### Paths in Grid (suma máxima)
```cpp
for (int y = 1; y <= n; y++)
    for (int x = 1; x <= n; x++)
        dp[y][x] = max(dp[y-1][x], dp[y][x-1]) + grid[y][x];
// Respuesta: dp[n][n]
```

### Interval DP (genérico)
```cpp
// Inicializar dp[i][i] = caso_base
for (int len = 2; len <= n; len++)
    for (int i = 0; i+len-1 < n; i++) {
        int j = i+len-1;
        dp[i][j] = INF;
        for (int k = i; k < j; k++)
            dp[i][j] = min(dp[i][j], dp[i][k]+dp[k+1][j]+cost(i,j));
    }
// Respuesta: dp[0][n-1]
```

### TSP con Bitmask
```cpp
const int INF = 1e9;
int dp[20][1<<20];
memset(dp, 0x3f, sizeof dp);  // 0x3f3f3f3f ≈ 10^9, safe para sumas
dp[0][1] = 0;  // ciudad 0, ciudad 0 visitada
for (int mask = 1; mask < (1<<n); mask++)
    for (int u = 0; u < n; u++) {
        if (!(mask & (1<<u))) continue;
        if (dp[u][mask] == INF) continue;
        for (int v = 0; v < n; v++) {
            if (mask & (1<<v)) continue;
            dp[v][mask|(1<<v)] = min(dp[v][mask|(1<<v)], dp[u][mask]+dist[u][v]);
        }
    }
// Respuesta: min sobre u de dp[u][(1<<n)-1] + dist[u][0]
```

### Top-Down template
```cpp
int memo[MAXN][MAXM];
int dp(int i, int j) {
    if (/*caso base*/) return val;
    int &ans = memo[i][j];
    if (ans != -1) return ans;
    ans = INF; // o 0, o lo que corresponda
    // ... transición ...
    return ans;
}
// En main: memset(memo, -1, sizeof memo);
```

---

## Límites de complejidad

| $n$ | Complejidad máxima aceptable |
|-----|------------------------------|
| $\leq 10$ | $O(n!)$ |
| $\leq 20$ | $O(2^n \cdot n)$ — Bitmask DP |
| $\leq 100$ | $O(n^3)$ — Interval DP |
| $\leq 1{,}000$ | $O(n^2)$ |
| $\leq 10{,}000$ | $O(n^2)$ (ajustado) o $O(n^2 / 64)$ con bitset |
| $\leq 100{,}000$ | $O(n \log n)$ |
| $\leq 1{,}000{,}000$ | $O(n)$ o $O(n \log n)$ |

*(Regla: $10^8$ operaciones simples ≈ 1 segundo)*

---

## Checklist pre-envío (2 minutos)

```
□ ¿Probé el ejemplo del enunciado?
□ ¿Probé N=1?
□ ¿El tipo de dato es correcto? (int vs long long)
□ ¿Uso INF = 1e9 (no INT_MAX)?
□ ¿El orden del loop interno en Knapsack es correcto?
  → 0/1: derecha a izquierda
  → Ilimitado: izquierda a derecha
□ ¿Reinicializo entre casos de prueba?
□ ¿Aplico módulo donde el conteo puede crecer?
□ ¿La respuesta está en dp[n] o en max(dp[0..n])?
```

---

## Errores comunes en 5 segundos

| Síntoma | Causa probable |
|---------|----------------|
| WA en todos los casos | Estado incorrecto o transición incompleta |
| WA en casos grandes | Overflow (`int` → `long long`) |
| WA en N=0 o N=1 | Inicialización de casos base |
| Respuesta siempre INF | No inicializaste dp[0] = 0 (Coin Change) |
| Ítem tomado múltiples veces | Loop de Knapsack 0/1 va izquierda→derecha |
| TLE | Complejidad incorrecta, considera optimización |
| Segfault / RE | Índice fuera de rango o stack overflow (recursión muy profunda) |

---

## Constantes útiles

```cpp
const int INF = 1e9;           // para minimización
const long long LINF = 1e18;   // para minimización con long long
const int MOD = 1e9 + 7;       // módulo estándar
const int NEG_INF = -1e9;      // para maximización

// memset rápido:
memset(dp, 0, sizeof dp);      // todos a 0
memset(dp, -1, sizeof dp);     // todos a -1 (memoización)
memset(dp, 0x3f, sizeof dp);   // todos a 0x3f3f3f3f ≈ 10^9 (INF para int)
```

---

*Fuentes: CP4 §3.5 · CPH Cap. 7 · Rascó Galván*

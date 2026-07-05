# 08. Optimizaciones de DP: Bitmask, Convex Hull, Monotone Queue

> *"Cuando O(n²) da TLE, las técnicas de optimización DP pueden salvarte."*

**Tabla de Contenidos**
- [Sección A: Bitmask DP — TSP y variantes](#sección-a-bitmask-dp--tsp-y-variantes)
- [Sección B: Convex Hull Trick](#sección-b-convex-hull-trick)
- [Sección C: Monotone Queue Optimization](#sección-c-monotone-queue-optimization)
- [Sección D: Divide and Conquer DP](#sección-d-divide-and-conquer-dp)
- [Sección E: Cuándo usar cada optimización](#sección-e-cuándo-usar-cada-optimización)

---

## Sección A: Bitmask DP — TSP y variantes

### Cuándo usar Bitmask DP

Cuando el estado necesita representar un **subconjunto** de elementos, y $n \leq 20$ (máximo $\sim 25$ en práctica).

**La idea**: representar un subconjunto de $\{0, 1, \ldots, n-1\}$ como un entero de $n$ bits. El bit $i$ está encendido si el elemento $i$ está en el conjunto.

```
mask = 0b1010 = 10 (decimal) significa: elementos {1, 3} están en el conjunto
bit 0 = 0 → elemento 0 NO está
bit 1 = 1 → elemento 1 SÍ está
bit 2 = 0 → elemento 2 NO está
bit 3 = 1 → elemento 3 SÍ está
```

### TSP — Traveling Salesman Problem (CP4 §3.5.e)

**Enunciado**: $n$ ciudades con distancias $\text{dist}[i][j]$. Encuentra el **tour mínimo** que visita cada ciudad exactamente una vez y regresa al inicio.

**Complejidad**: con bitmask DP, $O(2^n \cdot n^2)$. Funciona para $n \leq 18-19$.

**Estado**: $\text{dp}[u][\text{mask}]$ = distancia mínima para estar en la ciudad $u$ habiendo visitado las ciudades en `mask`.

**Transición**: para cada ciudad `v` no visitada en `mask`:
$$\text{dp}[v][\text{mask} | (1 << v)] = \min(\text{dp}[v][\text{mask} | (1 << v)],\ \text{dp}[u][\text{mask}] + \text{dist}[u][v])$$

**Caso base**: $\text{dp}[0][1] = 0$ (inicio en ciudad 0, `mask = 0b1` = solo ciudad 0 visitada).

**Respuesta**: $\min_u (\text{dp}[u][(1 << n) - 1] + \text{dist}[u][0])$ = mejor camino que visita todos y regresa.

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAXN = 20;
const int INF = 1e9;
int n;
int dist[MAXN][MAXN];
int dp[MAXN][1 << MAXN];

// Top-Down (CP4 estilo)
int tsp(int u, int mask) {
    if (mask == (1 << n) - 1) return dist[u][0];  // todos visitados, volver al inicio
    if (dp[u][mask] != -1) return dp[u][mask];
    
    dp[u][mask] = INF;
    for (int v = 0; v < n; v++) {
        if (mask & (1 << v)) continue;  // v ya visitado
        int next = tsp(v, mask | (1 << v));
        dp[u][mask] = min(dp[u][mask], dist[u][v] + next);
    }
    return dp[u][mask];
}

int main() {
    cin >> n;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) cin >> dist[i][j];
    
    memset(dp, -1, sizeof dp);
    cout << tsp(0, 1) << "\n";  // empezar en ciudad 0, con ciudad 0 visitada
    return 0;
}
// Complejidad: O(2^n × n^2)    Funciona para n ≤ 18-19
// Fuente: CP4 §3.5.e · Rascó §4.12
```

### Bitmask DP general — template

```cpp
// dp[mask] = solución óptima para el subconjunto 'mask'
int dp[1 << MAXN];
memset(dp, INF_or_0, sizeof dp);
dp[0] = base_case;

for (int mask = 0; mask < (1 << n); mask++) {
    // Iterar sobre subconjuntos de mask, o sobre elementos del complemento
    for (int i = 0; i < n; i++) {
        if (mask & (1 << i)) continue;  // i ya en mask
        // Transición: agregar i al mask
        dp[mask | (1 << i)] = min(dp[mask | (1 << i)], dp[mask] + costo(i));
    }
}
```

### Operaciones bit útiles

```cpp
// Verificar si el bit i está encendido
if (mask & (1 << i)) { /* i está en el conjunto */ }

// Encender el bit i
mask | (1 << i)

// Apagar el bit i
mask & ~(1 << i)   o   mask ^ (1 << i) (si estaba encendido)

// Número de bits encendidos
__builtin_popcount(mask)

// Bit menos significativo encendido (LSOne)
mask & (-mask)

// Posición del bit menos significativo
__builtin_ctz(mask)  // count trailing zeros

// Iterar sobre todos los subconjuntos de mask
for (int sub = mask; sub > 0; sub = (sub - 1) & mask) {
    // procesar subconjunto 'sub'
}
```

---

## Sección B: Convex Hull Trick

### Cuándo aplica

La transición tiene la forma:
$$\text{dp}[i] = \min_{j < i} \left( \text{dp}[j] + b[j] \cdot a[i] + c[i] \right)$$

Donde $b[j]$ y $a[i]$ son valores que varían. Esto es minimizar una colección de funciones lineales $f_j(x) = b[j] \cdot x + \text{dp}[j]$ evaluadas en $x = a[i]$.

**Reducción a O(n log n)** (o O(n) si $a[i]$ es monótono): mantener la "envolvente convexa inferior" de las líneas.

### Ejemplo típico: División de tareas

"Dado un array de trabajos con tiempos $T[i]$, divídelos en grupos. El costo de un grupo $[l, r]$ es alguna función que depende de $T[l..r]$. Minimiza el costo total."

*(Implementación completa requiere geometría computacional — fuera del scope básico)*

```cpp
// Plantilla simplificada del Convex Hull Trick (líneas con pendiente decreciente)
struct Line {
    long long m, b;
    long long eval(long long x) { return m * x + b; }
};

struct CHT {
    vector<Line> lines;
    
    void add(long long m, long long b) {
        Line l = {m, b};
        while (lines.size() >= 2) {
            // Verificar si la penúltima línea es redundante
            auto& l1 = lines[lines.size()-2];
            auto& l2 = lines[lines.size()-1];
            // Intersección l1 y l (nuevo) está a la izquierda de intersección l1 y l2
            if ((__int128)(l2.b - l1.b) * (l1.m - l.m) >= (__int128)(l.b - l1.b) * (l1.m - l2.m))
                lines.pop_back();
            else break;
        }
        lines.push_back(l);
    }
    
    long long query(long long x) {
        // Binary search para la mejor línea en x
        int lo = 0, hi = (int)lines.size() - 1;
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (lines[mid].eval(x) <= lines[mid+1].eval(x))
                hi = mid;
            else
                lo = mid + 1;
        }
        return lines[lo].eval(x);
    }
};
```

---

## Sección C: Monotone Queue Optimization

### Cuándo aplica

La transición tiene la forma:
$$\text{dp}[i] = \min_{j \in [i-k, i-1]} \text{dp}[j] + \text{costo}$$

Quieres el mínimo en una ventana deslizante de tamaño $k$.

**Reduce O(nk) a O(n)** usando una deque que mantiene el mínimo de la ventana.

```cpp
// Sliding window minimum con deque
deque<int> dq;  // guarda índices, dp[dq.front()] es el mínimo de la ventana

for (int i = 1; i <= n; i++) {
    // Remover elementos fuera de la ventana [i-k, i-1]
    while (!dq.empty() && dq.front() < i - k) dq.pop_front();
    
    // dp[i] = dp[mínimo en ventana] + costo
    if (!dq.empty()) dp[i] = dp[dq.front()] + costo(i);
    
    // Mantener deque: remover elementos del final que son peores que dp[i]
    while (!dq.empty() && dp[dq.back()] >= dp[i]) dq.pop_back();
    dq.push_back(i);
}
```

---

## Sección D: Divide and Conquer DP

### Cuándo aplica

La transición satisface la **propiedad de Monge** (o Quadrangle Inequality):
- El punto óptimo de división $k^*(i)$ para el estado $i$ es monótono en $i$.
- Es decir: si $i_1 < i_2$, entonces $k^*(i_1) \leq k^*(i_2)$.

**Reduce O(n²) a O(n log n)** usando divide & conquer sobre los estados.

```cpp
void solve(int lo, int hi, int opt_lo, int opt_hi) {
    if (lo > hi) return;
    int mid = (lo + hi) / 2;
    int best = -1;
    long long best_val = INF;
    
    // Buscar el óptimo para mid, acotado por [opt_lo, opt_hi]
    for (int k = opt_lo; k <= min(mid-1, opt_hi); k++) {
        long long val = dp_prev[k] + cost(k, mid);
        if (val < best_val) { best_val = val; best = k; }
    }
    
    dp[mid] = best_val;
    solve(lo, mid-1, opt_lo, best);
    solve(mid+1, hi, best, opt_hi);
}
```

---

## Sección E: Cuándo usar cada optimización

| Situación | Técnica | Complejidad |
|-----------|---------|-------------|
| Estado = subconjunto de $n \leq 20$ elementos | Bitmask DP | $O(2^n \cdot n)$ |
| Transición = mínimo de funciones lineales | Convex Hull Trick | $O(n)$ o $O(n \log n)$ |
| Transición = mínimo en ventana deslizante | Monotone Queue | $O(n)$ |
| Punto óptimo de división es monótono | Divide & Conquer DP | $O(n \log n)$ |
| Interval DP con Monge property | Knuth-Yao | $O(n^2)$ |

### La regla práctica

```
1. Primero implementa la solución DP correcta (aunque sea O(n²) o O(n³)).
2. Solo si hay TLE: analiza si la transición tiene estructura explotable.
3. Aplica la optimización correspondiente.

No intentes optimizar antes de que el código básico funcione.
```

---

**Referencias cruzadas**
- Ver `02_MOCHILA.md` para Knapsack (aplicación directa de bitmask para TSP)
- Ver `03_INTERVALOS.md` para Knuth-Yao como optimización de interval DP
- Ver `07_CONTEO_COMBINATORIOS.md` para Counting Tilings con bitmask

*Fuentes: CP4 §3.5.e · Rascó Galván §6.1*

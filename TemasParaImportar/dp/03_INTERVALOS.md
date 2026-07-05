# 03. DP de Intervalos: Rangos, Particionamiento y Matrix Chain

> *"En DP de intervalos, el arte está en identificar el punto de división óptimo."*  
> — Rascó Galván, DP Handbook §4.7

**Tabla de Contenidos**
- [Sección A: El patrón de DP en intervalos](#sección-a-el-patrón-de-dp-en-intervalos)
- [Sección B: Cutting Sticks — Ejemplo motivante](#sección-b-cutting-sticks--ejemplo-motivante)
- [Sección C: Matrix Chain Multiplication](#sección-c-matrix-chain-multiplication)
- [Sección D: Optimal BST y otras variantes](#sección-d-optimal-bst-y-otras-variantes)
- [Sección E: Orden de loops crítico](#sección-e-orden-de-loops-crítico)
- [Sección F: Debugging y errores](#sección-f-debugging-y-errores)

---

## Sección A: El patrón de DP en intervalos

### ¿Cuándo usar Interval DP?

El patrón de DP en intervalos aplica cuando:
1. El input es una secuencia (array, string, etc.)
2. La respuesta para un rango $[i, j]$ depende de cómo se divide en subestructuras
3. La división óptima prueba todos los puntos $k$ entre $i$ y $j$

**Señales en el enunciado**:
- "Particiona el array en segmentos de forma óptima"
- "¿Cuál es el orden óptimo para combinar/dividir?"
- "Minimiza el costo de procesar un rango"

### El patrón general

**Estado**: $\text{dp}[i][j]$ = solución óptima para el rango $[i, j]$.

**Transición**:
$$\text{dp}[i][j] = \min_{k \in [i, j-1]} \left( \text{dp}[i][k] + \text{dp}[k+1][j] + \text{costo}(i, j) \right)$$

**Casos base**: $\text{dp}[i][i] = 0$ (intervalo de un elemento, costo 0).

**Respuesta**: $\text{dp}[0][n-1]$.

**Complejidad**: $O(n^3)$ típicamente (tres loops: $i$, $j$, $k$).

### Por qué funciona

La clave es que si dividimos el rango $[i, j]$ en el punto $k$:
- La solución óptima para $[i, k]$ es independiente de la solución para $[k+1, j]$.
- Al probar todos los $k$ posibles, garantizamos que encontramos el punto de división óptimo.

La subestructura óptima se cumple: si la solución óptima de $[i, j]$ divide en $k^*$, entonces $\text{dp}[i][k^*]$ y $\text{dp}[k^*+1][j]$ son óptimos por inducción.

---

## Sección B: Cutting Sticks — Ejemplo motivante

### Enunciado (CP4 §3.5.3.2 — UVa 10003)

Tienes una vara de longitud $l$ y $n$ cortes en posiciones $A_1, A_2, \ldots, A_n$. El costo de un corte es la longitud de la vara que estás cortando. Encuentra el **orden óptimo** de cortes para minimizar el costo total.

**Ejemplo** (CP4 §3.5):
```
l = 100, cortes en: {25, 50, 75}

Orden izquierda→derecha: costo = 100 + 75 + 50 = 225
Orden óptimo (primero el 50): costo = 100 + 50 + 50 = 200
```

### Formulación

Añade los extremos: $A = \{0, 25, 50, 75, 100\}$ (índices 0 a 4).

**Estado**: $\text{cut}(i, j)$ = mínimo costo para hacer todos los cortes dentro del segmento $[A_i, A_j]$.

**Transición**: para cada posición de corte $k$ entre $i$ y $j$:
$$\text{cut}(i, j) = \min_{k \in (i, j)} \left( \text{cut}(i, k) + \text{cut}(k, j) + (A_j - A_i) \right)$$

$(A_j - A_i)$ es el costo del corte en $k$ (longitud del segmento actual).

**Casos base**: $\text{cut}(i-1, i) = 0$ (segmento ya no necesita más cortes).

### Implementación Top-Down

```cpp
#include <bits/stdc++.h>
using namespace std;

const int INF = 1e9;
int n, l;
int A[55];  // posiciones de corte + extremos 0 y l
bool vis[55][55];
int memo[55][55];

int cut(int left, int right) {
    if (right - left <= 1) return 0;  // no hay cortes entre left y right
    if (vis[left][right]) return memo[left][right];
    vis[left][right] = true;
    
    int ans = INF;
    for (int k = left + 1; k < right; k++) {
        int cost = cut(left, k) + cut(k, right) + (A[right] - A[left]);
        ans = min(ans, cost);
    }
    
    return memo[left][right] = ans;
}

int main() {
    cin >> l >> n;
    A[0] = 0; A[n+1] = l;
    for (int i = 1; i <= n; i++) cin >> A[i];
    sort(A, A + n + 2);
    
    cout << cut(0, n + 1) << "\n";
    return 0;
}
// Complejidad: O(n^3)
// Fuente: CP4 §3.5.3.2
```

### Implementación Bottom-Up

```cpp
int cutting_sticks_bu(int* A, int m) {
    // A: array de posiciones incluyendo 0 y l, de tamaño m
    vector<vector<int>> dp(m, vector<int>(m, 0));
    
    // Iterar por longitud del intervalo (de menor a mayor)
    for (int len = 2; len < m; len++) {
        for (int i = 0; i + len < m; i++) {
            int j = i + len;
            dp[i][j] = INF;
            for (int k = i + 1; k < j; k++) {
                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j] + A[j] - A[i]);
            }
        }
    }
    
    return dp[0][m-1];
}
// El orden de iteración: primero intervalos pequeños (len=2), luego más grandes
// Garantiza que dp[i][k] y dp[k][j] están calculados cuando los necesitamos
```

---

## Sección C: Matrix Chain Multiplication

### Enunciado (Rascó §4.7)

Dada una secuencia de $n$ matrices $A_1, A_2, \ldots, A_n$ donde la matriz $A_i$ tiene dimensiones $p_{i-1} \times p_i$. Multiplicar dos matrices de dimensiones $a \times b$ y $b \times c$ cuesta $a \times b \times c$ operaciones escalares. La multiplicación es asociativa. **¿Qué orden de paréntesis minimiza el total de operaciones?**

**Ejemplo**:
```
Matrices: A(10×30), B(30×5), C(5×60)
(AB)C: (10×30×5) + (10×5×60) = 1500 + 3000 = 4500
A(BC): (30×5×60) + (10×30×60) = 9000 + 18000 = 27000
Óptimo: (AB)C con costo 4500
```

### Estado y transición (Rascó §4.7)

**Estado**: $\text{mcm}(i, j)$ = mínimas operaciones para multiplicar la secuencia $A_i, \ldots, A_j$.

$$\text{mcm}(i, j) = \begin{cases} 0 & i = j \\ \min_{k \in [i+1, j]} \left( \text{mcm}(i, k-1) + \text{mcm}(k, j) + p_i \cdot p_k \cdot p_{j+1} \right) & i \neq j \end{cases}$$

Donde $p_i$ es la dimensión de la secuencia (la matriz $A_i$ tiene dimensiones $p_{i-1} \times p_i$, y $p$ tiene $n+1$ elementos).

### Implementación

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAXN = 505;
const int INF = 1 << 20;  // evitar overflow (Rascó usa 1<<20)
int n;
int p[MAXN];
bool vis[MAXN][MAXN];
int MCM[MAXN][MAXN];

int mcm(int i, int j) {
    if (i == j) return 0;           // una sola matriz, costo 0
    if (vis[i][j]) return MCM[i][j];
    vis[i][j] = true;
    
    int ans = INF;
    for (int k = i + 1; k <= j; k++) {
        // Dividir en [i, k-1] y [k, j]
        // Multiplicar los resultados: p[i] × p[k] × p[j+1]
        ans = min(ans, mcm(i, k-1) + mcm(k, j) + p[i] * p[k] * p[j+1]);
    }
    
    return MCM[i][j] = ans;
}

int main() {
    cin >> n;
    for (int i = 0; i <= n; i++) cin >> p[i];  // n+1 dimensiones
    cout << mcm(0, n-1) << "\n";
    return 0;
}
// Complejidad: O(n^3) · Fuente: Rascó §4.7
```

---

## Sección D: Optimal BST y otras variantes

### Optimal Binary Search Tree

**Problema**: dado un conjunto de $n$ claves con frecuencias de búsqueda $f_1, \ldots, f_n$, construir un BST que minimice el costo esperado de búsqueda.

**Estado**: $\text{dp}[i][j]$ = mínimo costo de búsqueda para claves $i$ a $j$ como subárbol.

$$\text{dp}[i][j] = \min_{k \in [i,j]} \left( \text{dp}[i][k-1] + \text{dp}[k+1][j] + \sum_{m=i}^{j} f_m \right)$$

La clave raíz $k$ tiene profundidad 1, los demás incrementan su profundidad en 1.

### Longest Palindromic Substring (variante de intervalo)

```
dp[i][j] = ¿es A[i..j] un palíndromo?
dp[i][i] = true
dp[i][i+1] = (A[i] == A[i+1])
dp[i][j] = (A[i] == A[j]) && dp[i+1][j-1]

Respuesta: mayor (j-i+1) donde dp[i][j] = true
```

### Burst Balloons (clásico ICPC)

*(LeetCode 312 — problema de concurso típico)*

Tengo $n$ globos con valores. Si reviento el globo $k$ del rango $[i, j]$, gano $A[i-1] \times A[k] \times A[j+1]$. ¿Máxima ganancia?

```
dp[i][j] = máxima ganancia reventando todos los globos en [i, j]
Clave: k es el ÚLTIMO globo en reventarse del rango [i, j]
dp[i][j] = max over k: dp[i][k-1] + dp[k+1][j] + A[i-1]*A[k]*A[j+1]
```

*(Nota: aquí k es el ÚLTIMO, no el PRIMERO como en otros interval DP — esta es la versión no obvia)*

---

## Sección E: Orden de loops crítico

### El error más común en Interval DP

```cpp
// ERROR: iterar por i y j directamente
for (int i = 0; i < n; i++) {
    for (int j = i+1; j < n; j++) {
        for (int k = i+1; k < j; k++) {
            // dp[i][k] puede no estar calculado todavía!
            // (si k > i y j-k < j-i, dp[i][k] se calculó)
            // (pero dp[k+1][j] puede no estar si j-(k+1) > j-i)
            // Depende del tamaño relativo
        }
    }
}
// Esto puede funcionar o no dependiendo del problema
// Es mejor hacerlo por longitud de intervalo

// CORRECTO: iterar por longitud de intervalo
for (int len = 2; len <= n; len++) {        // longitud del intervalo
    for (int i = 0; i + len - 1 < n; i++) { // inicio
        int j = i + len - 1;                  // fin
        for (int k = i; k < j; k++) {         // punto de división
            // dp[i][k] y dp[k+1][j] tienen longitudes < len → ya calculados
        }
    }
}
```

### ¿Por qué el orden por longitud garantiza correctitud?

Cuando calculamos `dp[i][j]` con longitud `len`:
- `dp[i][k]` tiene longitud `k - i + 1 ≤ len - 1` → ya calculado.
- `dp[k+1][j]` tiene longitud `j - k ≤ len - 1` → ya calculado.

Por inducción, cuando procesamos longitud `len`, todos los intervalos de longitud $<$ `len` están disponibles.

---

## Sección F: Debugging y errores

### Error 1: Inicialización incorrecta de la diagonal

```cpp
// Los casos base dp[i][i] = 0 deben estar ANTES del loop principal
for (int i = 0; i < n; i++) dp[i][i] = 0;  // intervalo de 1 elemento

// Si olvidas esto, dp[i][k] para k=i puede tener valor basura
```

### Error 2: Índices de las dimensiones en Matrix Chain

```cpp
// Matrices M_i tienen dimensiones p[i] × p[i+1] donde p tiene n+1 elementos
// Cuando divides [i, j] en k: el resultado es p[i] × p[j+1]
// CUIDADO: p[j+1] puede ser p[n] → asegúrate que el array tiene tamaño n+1

// Si usas 1-indexed: matriz i tiene dims p[i-1] × p[i]
// dp(i, j): costo de multiplicar A_i ... A_j
// Al dividir en k: costo adicional = p[i-1] × p[k] × p[j]
```

### Error 3: Overflow en Matrix Chain

```cpp
// p[i] puede ser hasta 500 → p[i]*p[k]*p[j+1] ≤ 500^3 = 1.25×10^8
// Esto cabe en int (max ~2×10^9), pero si tienes sumas de muchos de estos...
// Usa long long si tienes dudas:
long long ans = INF_LL;
ans = min(ans, (long long)p[i] * p[k] * p[j+1] + ...);
```

### Error 4: Confundir dónde va el punto k

```
Cutting Sticks: k es el punto de corte FÍSICO entre left y right
  → k va de (left+1) a (right-1)

Matrix Chain: k es la PRIMERA matriz del segundo grupo
  → [i, k-1] y [k, j], k va de (i+1) a j

¡La indexación varía por problema! Define exactamente qué representa k.
```

### Checklist de debugging para Interval DP

```
□ ¿Inicialicé dp[i][i] correctamente?
□ ¿Itero por longitud de intervalo (no solo por i y j)?
□ ¿El punto de corte k recorre el rango correcto?
□ ¿Las dimensiones del array son suficientes (n+1 para Matrix Chain)?
□ ¿Hay posible overflow en el costo?
□ ¿Probé con n=2 (intervalo mínimo con costo no-trivial)?
□ ¿Probé con n=3 para verificar que el punto de corte se elige correctamente?
```

---

**Referencias cruzadas**
- Ver `01_RECETA_UNIVERSAL.md` para el protocolo general
- Ver `08_OPTIMIZACIONES.md` para Knuth-Yao (reducir O(n³) a O(n²) en algunos casos)
- Ver `10_ERRORES_CONCEPTUALES.md` para errores de estado

*Fuentes: CP4 §3.5.3.2 (UVa 10003) · Rascó Galván §4.7*

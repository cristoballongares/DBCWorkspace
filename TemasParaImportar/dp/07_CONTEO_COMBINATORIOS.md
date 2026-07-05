# 07. Conteo y Combinatorios: Paths, Fibonacci, Catalan

> *"Contar formas es DP donde la transición suma en lugar de tomar el mínimo/máximo."*

**Tabla de Contenidos**
- [Sección A: El paradigma del conteo DP](#sección-a-el-paradigma-del-conteo-dp)
- [Sección B: Paths in Grid](#sección-b-paths-in-grid)
- [Sección C: Fibonacci y escaleras generalizadas](#sección-c-fibonacci-y-escaleras-generalizadas)
- [Sección D: Números de Catalan](#sección-d-números-de-catalan)
- [Sección E: Coeficientes binomiales](#sección-e-coeficientes-binomiales)
- [Sección F: Counting Tilings (Bitmask + DP)](#sección-f-counting-tilings-bitmask--dp)
- [Sección G: Aritmética modular en conteo](#sección-g-aritmética-modular-en-conteo)

---

## Sección A: El paradigma del conteo DP

### Diferencia con DP de optimización

En DP de **optimización**: `dp[i] = min/max(dp[j] + costo)` — elegir el mejor.
En DP de **conteo**: `dp[i] = sum(dp[j])` — sumar todas las formas de llegar.

### La transición de conteo

```
dp[i] = número de formas de alcanzar el estado i

Transición: dp[i] = dp[j1] + dp[j2] + ... + dp[jk]
  donde j1, j2, ..., jk son todos los estados desde los que puedo llegar a i
```

### Principio fundamental

**Principio de adición**: si hay $A$ formas de hacer X y $B$ formas de hacer Y (mutuamente excluyentes), hay $A + B$ formas de hacer "X o Y".

**Principio de multiplicación**: si hay $A$ formas de hacer X y $B$ formas de hacer Y (independientes), hay $A \times B$ formas de hacer "X y luego Y".

DP de conteo usa el principio de adición en la transición.

---

## Sección B: Paths in Grid

### Enunciado (CPH Cap. 7.3)

En una cuadrícula $n \times n$, cada celda tiene un valor. Solo puedes moverte hacia la derecha o hacia abajo. Encuentra la **suma máxima** en un camino de (1,1) a (n,n).

*(Variante: contar el número de caminos posibles)*

### Estado y transición

**Estado**: $\text{sum}(y, x)$ = máxima suma al llegar a la celda $(y, x)$.

**Transición** (CPH Cap. 7.3):
$$\text{sum}(y, x) = \max(\text{sum}(y, x-1),\ \text{sum}(y-1, x)) + \text{value}[y][x]$$

**Casos base**: $\text{sum}(y, 0) = 0$ y $\text{sum}(0, x) = 0$.

```cpp
// Paths in Grid — suma máxima (CPH Cap. 7.3)
int grid[MAXN][MAXN];
int dp[MAXN][MAXN];

int max_path(int n) {
    for (int y = 1; y <= n; y++) {
        for (int x = 1; x <= n; x++) {
            dp[y][x] = max(dp[y][x-1], dp[y-1][x]) + grid[y][x];
        }
    }
    return dp[n][n];
}
// Complejidad: O(n^2)
// Fuente: CPH Cap. 7.3
```

### Variante: contar número de caminos (sin obstáculos)

$$\text{count}(y, x) = \text{count}(y, x-1) + \text{count}(y-1, x)$$

```cpp
// Contar caminos de (1,1) a (n,n) solo moviendo derecha o abajo
long long dp[MAXN][MAXN];
dp[1][1] = 1;
for (int y = 1; y <= n; y++)
    for (int x = 1; x <= n; x++) {
        if (y == 1 && x == 1) continue;
        dp[y][x] = 0;
        if (y > 1) dp[y][x] += dp[y-1][x];
        if (x > 1) dp[y][x] += dp[y][x-1];
    }
// dp[n][n] = C(2n-2, n-1) (combinatoria, verificable)
```

### Variante: con obstáculos

```cpp
// Celda bloqueada: dp[y][x] = 0 (no se puede llegar)
for (int y = 1; y <= n; y++)
    for (int x = 1; x <= n; x++) {
        if (blocked[y][x]) { dp[y][x] = 0; continue; }
        dp[y][x] = 0;
        if (y > 1) dp[y][x] += dp[y-1][x];
        if (x > 1) dp[y][x] += dp[y][x-1];
        dp[y][x] %= MOD;  // si el conteo puede ser grande
    }
```

---

## Sección C: Fibonacci y escaleras generalizadas

### Fibonacci como DP de conteo

El problema de las escaleras: "¿de cuántas formas puedes subir $n$ escalones si puedes dar 1 o 2 pasos por vez?"

$$F(n) = F(n-1) + F(n-2)$$

Esto es exactamente Fibonacci. $F(n)$ = número de formas de subir $n$ escalones.

### Las tres versiones de Fibonacci (Rascó §4.3)

**Versión 1 — Directa** $\langle O(1), O(n) \rangle$:
```cpp
long long F(int n) {
    if (n <= 2) return 1;
    long long a = 1, b = 1, c;
    for (int i = 3; i <= n; i++) { c = a + b; a = b; b = c; }
    return c;
}
// Si hay múltiples queries, cada una toma O(n) → subóptimo
```

**Versión 2 — Almacenada** $\langle O(n), O(n) \rangle$:
```cpp
long long F[MAXN];
void precompute(int n) {
    F[1] = F[2] = 1;
    for (int i = 3; i <= n; i++) F[i] = F[i-1] + F[i-2];
}
// Una vez precalculado: query en O(1)
// Fuente: Rascó §4.3.2
```

**Versión 3 — Rápida** $\langle O(\log n), O(\log^2 n) \rangle$:
```cpp
// Usa la propiedad:
// F(2k) = (2F(k-1) + F(k)) × F(k)
// F(2k-1) = F(k)² + F(k-1)²
unordered_map<int,long long> memo_fib;
long long fib_fast(int n) {
    if (n <= 2) return 1;
    if (memo_fib.count(n)) return memo_fib[n];
    if (n & 1) {  // impar
        int k = (n + 1) / 2;
        return memo_fib[n] = fib_fast(k)*fib_fast(k) + fib_fast(k-1)*fib_fast(k-1);
    } else {  // par
        int k = n / 2;
        return memo_fib[n] = (2*fib_fast(k-1) + fib_fast(k)) * fib_fast(k);
    }
}
// Fuente: Rascó §4.3.3
```

### Escaleras generalizadas (k pasos)

"¿De cuántas formas puedes subir $n$ escalones si puedes dar $1, 2, \ldots, k$ pasos?"

$$\text{dp}[n] = \text{dp}[n-1] + \text{dp}[n-2] + \ldots + \text{dp}[n-k]$$

```cpp
long long climb_stairs(int n, int k) {
    vector<long long> dp(n+1, 0);
    dp[0] = 1;  // 1 forma de estar en el piso 0 (no moverse)
    
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= k && j <= i; j++) {
            dp[i] += dp[i-j];
        }
    }
    return dp[n];
}
```

---

## Sección D: Números de Catalan

### Definición (Rascó §4.2)

Los números de Catalan son:
$$C_0 = 1, \quad C_n = \sum_{i=0}^{n-1} C_i \cdot C_{n-1-i}$$

Aparecen en:
- Número de expresiones con $n$ pares de paréntesis correctamente balanceados
- Número de formas de triangular un polígono de $n+2$ lados
- Número de BSTs distintos con $n$ nodos
- Número de caminos que no cruzan la diagonal en una cuadrícula $n \times n$

**Valores**: 1, 1, 2, 5, 14, 42, 132, 429, ...

```cpp
// Números de Catalan — Bottom Up (Rascó §4.2)
const int MAXN = 10005;
long long C[MAXN];

void catalan(int n) {
    C[0] = 1;
    for (int i = 1; i <= n; i++) {
        C[i] = 0;
        for (int j = 0; j <= i - 1; j++) {
            C[i] += C[j] * C[i - 1 - j];
        }
    }
}
// Complejidad: O(n^2)
// CUIDADO: Crece muy rápido → usar módulo para n > ~20
```

---

## Sección E: Coeficientes binomiales

### El triángulo de Pascal (Rascó §4.1)

$$\binom{a}{b} = \binom{a-1}{b-1} + \binom{a-1}{b}$$

Casos base: $\binom{n}{0} = \binom{n}{n} = 1$.

```cpp
// Bottom-Up: calcula todos los C(a,b) con 0 ≤ a ≤ n, 0 ≤ b ≤ a
const int MAXN = 10005;
long long memo[MAXN][MAXN];

void binomials(int n) {
    for (int i = 0; i <= n; i++) {
        for (int j = 0; j <= i; j++) {
            if (j == 0 || j == i)
                memo[i][j] = 1;
            else
                memo[i][j] = memo[i-1][j-1] + memo[i-1][j];
        }
    }
}
// Uso: memo[a][b] = C(a, b)
// Fuente: Rascó §4.1
```

### Cuidado con el tamaño

$\binom{n}{n/2}$ crece como $\frac{2^n}{\sqrt{n}}$. Para $n=60$: $\approx 10^{17}$. Usa `long long` con módulo.

```cpp
// Con módulo
const int MOD = 1e9 + 7;
long long memo[MAXN][MAXN];
void binomials_mod(int n) {
    for (int i = 0; i <= n; i++) {
        for (int j = 0; j <= i; j++) {
            if (j == 0 || j == i)
                memo[i][j] = 1;
            else
                memo[i][j] = (memo[i-1][j-1] + memo[i-1][j]) % MOD;
        }
    }
}
```

---

## Sección F: Counting Tilings (Bitmask + DP)

### El problema (CPH Cap. 7.6)

¿De cuántas formas puedes rellenar una cuadrícula $n \times m$ con losetas $1 \times 2$ y $2 \times 1$?

### La idea del estado por fila

Procesas fila por fila. El estado de la fila $k$ determina completamente cómo puede ser la fila $k+1$.

Con la representación compacta: `dp[k][x]` = número de formas de completar hasta la fila $k$ tal que el "perfil" de la fila $k$ es $x$ (bitmask de qué columnas tienen la parte superior de una loseta vertical).

```cpp
// Counting Tilings — O(n × 2^m × 2^m)
// Para grids pequeñas (m ≤ 15 aproximadamente)
int n, m;
long long dp[2][1 << 15];

// (Implementación completa requiere un checker de compatibilidad de perfiles)
// Esta técnica es avanzada — ver 08_OPTIMIZACIONES.md para bitmask DP

// Versión simplificada del conteo (CPH):
// dp[k][x]: estado de la fila k es x (columnas que "sobresalen" hacia abajo)
// Transición: dp[k+1][y] += dp[k][x] si los perfiles x e y son compatibles
```

*(Ver `08_OPTIMIZACIONES.md` para el desarrollo completo de bitmask DP)*

---

## Sección G: Aritmética modular en conteo

### ¿Por qué se usa módulo?

En problemas de conteo, la respuesta puede ser astronómicamente grande:
- "¿Cuántas formas de...?" con $n = 100$ puede dar $10^{100}$
- Los problemas tipicamente piden la respuesta módulo un primo $p$ (usualmente $10^9 + 7$)

### Cómo aplicar módulo correctamente

```cpp
const long long MOD = 1e9 + 7;

// SUMA: siempre safe
dp[i] = (dp[j1] + dp[j2]) % MOD;

// MULTIPLICACIÓN: safe si los factores son < MOD (< 10^9)
dp[i] = (dp[j1] * dp[j2]) % MOD;  // si dp[j] < MOD, el producto < MOD^2 < LLONG_MAX ✓

// NO PUEDES DIVIDIR directamente módulo p
// Necesitas el inverso modular (Teorema de Fermat si p es primo):
// a / b mod p = a * b^(p-2) mod p   donde b^(p-2) = inverso de b mod p
```

### Inverso modular (para divisiones en módulo)

```cpp
long long power(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) result = result * base % mod;
        base = base * base % mod;
        exp >>= 1;
    }
    return result;
}

long long modinv(long long a, long long p) {
    return power(a, p - 2, p);  // solo si p es primo (Fermat's Little Theorem)
}

// Combinaciones con módulo:
// C(n, k) = n! / (k! × (n-k)!)
// C_mod(n, k) = fact[n] * modinv(fact[k], MOD) % MOD * modinv(fact[n-k], MOD) % MOD
```

---

**Referencias cruzadas**
- Ver `06_SUMAS_SUBCONJUNTOS.md` para conteo en Coin Change
- Ver `08_OPTIMIZACIONES.md` para bitmask DP (Counting Tilings completo)
- Ver `03_INTERVALOS.md` para Catalan en Matrix Chain

*Fuentes: CPH Cap. 7.1, 7.3, 7.6 · Rascó Galván §4.1–4.3*

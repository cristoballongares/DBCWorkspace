# 04. DP en Cadenas: LCS, Edit Distance, LIS y Variantes

> *"Las dos strings son dos mundos que se recorren en paralelo. El estado captura tu posición en ambos."*

**Tabla de Contenidos**
- [Sección A: LCS — Longest Common Subsequence](#sección-a-lcs--longest-common-subsequence)
- [Sección B: Edit Distance (Levenshtein)](#sección-b-edit-distance-levenshtein)
- [Sección C: LIS — Longest Increasing Subsequence](#sección-c-lis--longest-increasing-subsequence)
- [Sección D: Otras variantes de strings](#sección-d-otras-variantes-de-strings)
- [Sección E: Debugging y errores comunes](#sección-e-debugging-y-errores-comunes)

---

## Sección A: LCS — Longest Common Subsequence

### Enunciado

Dadas dos strings $A$ (longitud $m$) y $B$ (longitud $n$), encontrar la **longitud de la subsecuencia común más larga** (no necesariamente contigua).

**Ejemplo** (Rascó §4.8):
```
A = "carro"
B = "arcilla"
LCS = "ar" o "ca" → longitud 2
```

**¿Qué es subsecuencia?** Una subsecuencia preserva el orden relativo pero no requiere ser contigua.
- "ace" es subsecuencia de "abcde"
- "aec" NO es subsecuencia de "abcde" (rompe el orden)

### Intuición profunda

Piensa en dos punteros, uno en $A$ y otro en $B$, avanzando de izquierda a derecha:

- Si `A[i] == B[j]`: ¡coincidencia! Este carácter forma parte de alguna LCS. Lo tomamos y avanzamos ambos punteros.
- Si `A[i] != B[j]`: tenemos dos opciones para "desempatar":
  - Avanzar $A$ (ignorar `A[i]`)
  - Avanzar $B$ (ignorar `B[j]`)
  - Tomamos el máximo de ambas opciones.

**¿Por qué la subestructura es óptima?** Porque si la LCS de $A[0..i]$ y $B[0..j]$ incluye `A[i] = B[j]`, entonces la parte anterior de esa LCS es la LCS óptima de $A[0..i-1]$ y $B[0..j-1]$. Por contradicción (si hubiera una LCS más larga de los prefijos más cortos, podría extenderse con `A[i]` para superar la LCS global — contradicción).

### Estado y transición

**Estado**: $\text{dp}[i][j]$ = longitud de LCS de $A[0..i-1]$ y $B[0..j-1]$.

**Transición** (CPH Cap. 7, Rascó §4.8):
$$\text{dp}[i][j] = \begin{cases} 1 + \text{dp}[i-1][j-1] & \text{si } A[i-1] = B[j-1] \\ \max(\text{dp}[i-1][j],\ \text{dp}[i][j-1]) & \text{si } A[i-1] \neq B[j-1] \end{cases}$$

**Casos base**: $\text{dp}[0][j] = 0$ y $\text{dp}[i][0] = 0$ (string vacía no tiene LCS).

**Respuesta**: $\text{dp}[m][n]$.

**Complejidad**: $O(mn)$ tiempo, $O(mn)$ espacio.

### Visualización de la tabla

```
    ""  c  a  r  r  o
""   0  0  0  0  0  0
a    0  0  1  1  1  1
r    0  0  1  2  2  2
c    0  1  1  2  2  2
i    0  1  1  2  2  2
l    0  1  1  2  2  2
l    0  1  1  2  2  2
a    0  1  2  2  2  2

LCS("carro", "arcilla") = dp[7][5] = 2  ✓
```

### Implementación Bottom-Up

```cpp
#include <bits/stdc++.h>
using namespace std;

int lcs(const string& A, const string& B) {
    int m = A.size(), n = B.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (A[i-1] == B[j-1])
                dp[i][j] = 1 + dp[i-1][j-1];    // coincidencia
            else
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]); // máximo de saltar uno
        }
    }
    
    return dp[m][n];
}
// Complejidad: O(m×n) tiempo y espacio
// Fuente: CPH Cap. 7 · Rascó §4.8
```

### Implementación Top-Down (Rascó estilo)

```cpp
int n, m;
string x, y;
bool vis[10005][10005];
int memo[10005][10005];

int LCS(int i, int j) {
    if (i < 0 || j < 0) return 0;
    if (vis[i][j]) return memo[i][j];
    vis[i][j] = true;
    if (x[i] == y[j]) return memo[i][j] = 1 + LCS(i-1, j-1);
    return memo[i][j] = max(LCS(i-1, j), LCS(i, j-1));
}
// Llamar: LCS(m-1, n-1)
```

### Reconstrucción de la LCS

Para obtener la subsecuencia real (no solo su longitud):

```cpp
string reconstruct_lcs(const string& A, const string& B, 
                        vector<vector<int>>& dp) {
    string result = "";
    int i = A.size(), j = B.size();
    
    while (i > 0 && j > 0) {
        if (A[i-1] == B[j-1]) {
            result = A[i-1] + result;  // prepend (construimos al revés)
            i--; j--;
        } else if (dp[i-1][j] > dp[i][j-1]) {
            i--;  // vinimos desde arriba
        } else {
            j--;  // vinimos desde la izquierda
        }
    }
    return result;
}
```

### Optimización de espacio a O(min(m,n))

Como `dp[i][j]` solo depende de `dp[i-1][*]`, podemos usar dos filas:

```cpp
int lcs_optimized(const string& A, const string& B) {
    int m = A.size(), n = B.size();
    vector<int> prev(n+1, 0), curr(n+1, 0);
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (A[i-1] == B[j-1])
                curr[j] = 1 + prev[j-1];
            else
                curr[j] = max(prev[j], curr[j-1]);
        }
        prev = curr;
    }
    return prev[n];
}
// Espacio: O(n), donde n = min(|A|, |B|) si orientas correctamente
```

---

## Sección B: Edit Distance (Levenshtein)

### Enunciado

Dadas dos strings $A$ y $B$, encontrar el **mínimo número de operaciones** para transformar $A$ en $B$, usando: **insertar**, **eliminar**, **reemplazar** un carácter.

**Ejemplo** (CPH Cap. 7.5):
```
LOVE → MOVIE
LOVE → MOVE  (reemplazar L por M): 1 op
MOVE → MOVIE (insertar I): 1 op
Total: 2 operaciones (es el mínimo)
```

*(Edit Distance = 2 entre LOVE y MOVIE)*

### Intuición profunda

Considera las posiciones $i$ en $A$ y $j$ en $B$. El estado `dp[i][j]` es el mínimo costo para transformar $A[0..i-1]$ en $B[0..j-1]$.

En el último paso:
- **Coincidencia** (`A[i-1] == B[j-1]`): no necesito operación. `dp[i][j] = dp[i-1][j-1]`.
- **Reemplazar** `A[i-1]` por `B[j-1]`: `dp[i][j] = 1 + dp[i-1][j-1]`.
- **Eliminar** `A[i-1]` de $A$: `dp[i][j] = 1 + dp[i-1][j]`.
  *(Transformar A[0..i-2] en B[0..j-1], luego eliminar A[i-1])*
- **Insertar** `B[j-1]` al final de $A$: `dp[i][j] = 1 + dp[i][j-1]`.
  *(Transformar A[0..i-1] en B[0..j-2], luego insertar B[j-1])*

Tomo el mínimo de todas las opciones válidas.

### Estado y transición

**Estado**: $\text{dp}[i][j]$ = mínimas operaciones para transformar $A[0..i-1]$ en $B[0..j-1]$.

**Transición** (CPH Cap. 7.5):
$$\text{dp}[i][j] = \begin{cases} \text{dp}[i-1][j-1] & \text{si } A[i-1] = B[j-1] \\ 1 + \min(\text{dp}[i-1][j-1],\ \text{dp}[i-1][j],\ \text{dp}[i][j-1]) & \text{si } A[i-1] \neq B[j-1] \end{cases}$$

**Casos base** (Rascó §4.13):
- $\text{dp}[i][0] = i$ (eliminar $i$ caracteres de $A$)
- $\text{dp}[0][j] = j$ (insertar $j$ caracteres en $A$ vacía)
- $\text{dp}[0][0] = 0$ (ambas vacías, costo 0)

### Tabla de ejemplo: LOVE → MOVIE

```
     ""  M  O  V  I  E
""    0  1  2  3  4  5
L     1  1  2  3  4  5
O     2  2  1  2  3  4
V     3  3  2  1  2  3
E     4  4  3  2  2  2

Edit Distance = dp[4][5] = 2  ✓
```

La tabla muestra las operaciones: una reemplazar (L→M) + una insertar (I).

### Implementación

```cpp
int edit_distance(const string& A, const string& B) {
    int m = A.size(), n = B.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1));
    
    // Casos base
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (A[i-1] == B[j-1]) {
                dp[i][j] = dp[i-1][j-1];  // sin costo
            } else {
                dp[i][j] = 1 + min({dp[i-1][j-1],  // reemplazar
                                    dp[i-1][j],      // eliminar
                                    dp[i][j-1]});    // insertar
            }
        }
    }
    return dp[m][n];
}
// Complejidad: O(m×n) tiempo y espacio
// Fuente: CPH Cap. 7.5 · Rascó §4.13
```

### Variante: solo insertar y eliminar (sin reemplazar)

```cpp
// Reemplazar = eliminar + insertar = costo 2
// Cambia: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1])  cuando A[i-1] != B[j-1]
// y NO incluir dp[i-1][j-1] + 1 como opción
```

---

## Sección C: LIS — Longest Increasing Subsequence

### Enunciado

Dado un array $A$ de $n$ enteros, encontrar la **longitud de la subsecuencia estrictamente creciente más larga**.

**Ejemplo** (CP4 §3.5.b):
```
A = {-7, 10, 9, 2, 3, 8, 8, 1}
LIS = {-7, 2, 3, 8} → longitud 4
```

### Algoritmo $O(n^2)$ — DP clásico

**Estado**: $\text{LIS}[i]$ = longitud de la LIS que termina en el índice $i$.

**Transición** (CPH Cap. 7.2):
$$\text{LIS}[i] = 1 + \max_{j < i,\ A[j] < A[i]} \text{LIS}[j]$$

Si no hay tal $j$, $\text{LIS}[i] = 1$ (solo el elemento $A[i]$).

**Respuesta**: $\max_k \text{LIS}[k]$.

```cpp
int lis_n2(vector<int>& A) {
    int n = A.size();
    vector<int> dp(n, 1);  // cada elemento es LIS de longitud 1 por sí solo
    
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (A[j] < A[i]) {           // condición creciente
                dp[i] = max(dp[i], dp[j] + 1);
            }
        }
    }
    
    return *max_element(dp.begin(), dp.end());
}
// Fuente: CPH Cap. 7.2 · Rascó §4.9
```

### Algoritmo $O(n \log n)$ — Greedy + Binary Search

Para $n \leq 10^5$, el $O(n^2)$ da TLE. Necesitas el algoritmo de "patience sorting".

**Idea** (CP4 §3.5.b):
Mantén un array `L` donde `L[k]` = el menor elemento final posible de una LIS de longitud $k+1$.

```
Invariante: L siempre está ordenado de menor a mayor.
Para cada A[i]:
  - Busca (binary search) la posición pos donde insertar A[i] en L
  - Reemplaza L[pos] = A[i]  (greedy: un final menor facilita extensiones futuras)
  - Si pos == tamaño de L: extendemos la LIS por 1
```

**¿Por qué es correcto?** La longitud de `L` al final es la longitud de la LIS. Los valores en `L` NO son la LIS real, pero su longitud sí es correcta.

```cpp
int lis_nlogn(vector<int>& A) {
    int n = A.size();
    vector<int> L;  // L[k] = menor elemento final de LIS de longitud k+1
    
    for (int i = 0; i < n; i++) {
        // lower_bound encuentra la primera posición donde L[pos] >= A[i]
        auto it = lower_bound(L.begin(), L.end(), A[i]);
        
        if (it == L.end()) {
            L.push_back(A[i]);    // A[i] extiende la LIS más larga conocida
        } else {
            *it = A[i];           // reemplaza con elemento más pequeño (greedy)
        }
    }
    
    return L.size();
}
// Complejidad: O(n log n)
// Fuente: CP4 §3.5.b

// NOTA: lower_bound para estrictamente creciente.
// Para no-decreciente (A[j] <= A[i]): usar upper_bound en vez de lower_bound
```

### Traza del algoritmo paso a paso

```
A = {-7, 10, 9, 2, 3, 8}

i=0: A[0]=-7. L vacío → push. L = {-7}
i=1: A[1]=10. lower_bound(-7,10,...,10)=fin → push. L = {-7, 10}
i=2: A[2]=9.  lower_bound(9)=posición 1 → reemplaza L[1]. L = {-7, 9}
i=3: A[3]=2.  lower_bound(2)=posición 1 → reemplaza L[1]. L = {-7, 2}
i=4: A[4]=3.  lower_bound(3)=posición 2 → extender. L = {-7, 2, 3}
i=5: A[5]=8.  lower_bound(8)=posición 3 → extender. L = {-7, 2, 3, 8}

Respuesta: |L| = 4  ✓
```

---

## Sección D: Otras variantes de strings

### Longest Palindromic Subsequence (LPS)

La subsecuencia palindrómica más larga de $A$ = LCS($A$, reverse($A$)).

```cpp
int lps(const string& A) {
    string B = A;
    reverse(B.begin(), B.end());
    return lcs(A, B);  // usa la función LCS de Sección A
}
// Complejidad: O(n^2) donde n = |A|
```

### Shortest Common Supersequence (SCS)

La supersequence más corta que contiene a $A$ y $B$ como subsecuencias.

$$|SCS| = |A| + |B| - |LCS(A, B)|$$

*(Añades todos los caracteres únicos de ambas strings, pero los comunes se comparten)*

### Substring vs Subsecuencia

```
SUBSECUENCIA: preserva orden, no necesita ser contigua
  "ace" es subsecuencia de "abcde" ✓
  "aec" NO es subsecuencia (rompe orden) ✗

SUBSTRING (subarray contiguo): debe ser contigua
  "bcd" es substring de "abcde" ✓
  "ace" NO es substring ✗
```

**El código difiere**:
- LCS: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])` cuando no coincide (puedo saltar)
- Longest Common Substring: `dp[i][j] = 0` cuando no coincide (debo empezar de nuevo)

```cpp
// Longest Common Substring
int lcs_substring(const string& A, const string& B) {
    int m = A.size(), n = B.size(), ans = 0;
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (A[i-1] == B[j-1]) {
                dp[i][j] = 1 + dp[i-1][j-1];
                ans = max(ans, dp[i][j]);
            }
            // Si no coincide: dp[i][j] = 0 (ya inicializado)
        }
    }
    return ans;
}
```

---

## Sección E: Debugging y errores comunes

### Error 1: Confundir subsecuencia con substring

```
Síntoma: LCS da WA porque usas dp[i][j] = 0 cuando no coincide
Fix: Para subsecuencia, NO resetear a 0. Toma max(dp[i-1][j], dp[i][j-1]).
```

### Error 2: Casos base de Edit Distance incorrectos

```cpp
// ERROR: no inicializar dp[i][0] y dp[0][j]
// Resultado: dp[3][5] asume que transformar 3 chars en vacío cuesta 0

// CORRECTO:
for (int i = 0; i <= m; i++) dp[i][0] = i;  // i eliminaciones
for (int j = 0; j <= n; j++) dp[0][j] = j;  // j inserciones
```

### Error 3: LIS $O(n \log n)$ con `upper_bound` vs `lower_bound`

```
lower_bound: estrictamente creciente (A[j] < A[i])
upper_bound: no-decreciente (A[j] <= A[i])

Si el problema dice "strictly increasing" → lower_bound
Si dice "non-decreasing" → upper_bound
```

### Error 4: Índices 0-based vs 1-based en la tabla

```cpp
// Estado dp[i][j] donde i y j son longitudes de prefijos (1-indexed):
// A[0..i-1] y B[0..j-1]
// Entonces A[i-1] es el último carácter del prefijo de longitud i

// Si usas 0-indexed:
// dp[i][j] = LCS de A[0..i] y B[0..j]
// Transición: dp[i][j] = dp[i-1][j-1] + 1  cuando A[i] == B[j]
// Casos base: dp[-1][j] = dp[i][-1] = 0 (manejar con cuidado)
```

### Checklist de debugging

```
□ ¿Es subsecuencia o substring? (¿reseteo a 0 cuando no coincide?)
□ ¿Los casos base cubren strings vacías correctamente?
□ ¿Los índices son consistentes (0-based o 1-based en toda la función)?
□ Para LIS: ¿uso lower_bound (estricto) o upper_bound (no-decreciente)?
□ Para Edit Distance: ¿considero las 3 operaciones o solo 2?
□ ¿Probé con strings idénticas (respuesta = longitud, 0 ediciones)?
□ ¿Probé con strings sin nada en común (LCS=0, Edit Distance=m+n)?
```

---

**Referencias cruzadas**
- Ver `06_SUMAS_SUBCONJUNTOS.md` para variantes de conteo
- Ver `03_INTERVALOS.md` para Longest Palindromic Substring (usa interval DP)
- Ver `01_RECETA_UNIVERSAL.md` para el protocolo general

*Fuentes: CP4 §3.5.b · CPH Cap. 7.2, 7.5 · Rascó Galván §4.8, 4.9, 4.13, 5.2*

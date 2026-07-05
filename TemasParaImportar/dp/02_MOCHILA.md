# 02. El Problema de la Mochila (Knapsack)

> *"El Knapsack 0/1 es quizás el problema DP más importante. Domínalo a fondo."*  
> — Tradición ICPC

**Tabla de Contenidos**
- [Sección A: Mochila 0/1 — El Problema Central](#sección-a-mochila-01--el-problema-central)
- [Sección B: Optimización de Espacio a O(W)](#sección-b-optimización-de-espacio-a-ow)
- [Sección C: Mochila Ilimitada (Unbounded Knapsack)](#sección-c-mochila-ilimitada-unbounded-knapsack)
- [Sección D: Variantes de Mochila](#sección-d-variantes-de-mochila)
- [Sección E: Debugging y trampas](#sección-e-debugging-y-trampas)

---

## Sección A: Mochila 0/1 — El Problema Central

### Enunciado exacto

Tienes $n$ ítems. El ítem $i$ tiene **valor** $v_i$ y **peso** $w_i$. Tienes una mochila con **capacidad máxima** $S$. Cada ítem lo puedes tomar o dejar (0 o 1 vez). Encuentra el **máximo valor** que puedes cargar sin exceder la capacidad.

**Ejemplo** (CP4 §3.5.c):
```
n=4, S=12
Ítem 0: valor=100, peso=10
Ítem 1: valor=70,  peso=4
Ítem 2: valor=50,  peso=6
Ítem 3: valor=10,  peso=12

Respuesta: 120 (ítems 1+2: peso=10, valor=70+50=120)
```

### Intuición profunda

Para cada ítem, tienes exactamente DOS opciones:
1. **No lo tomas**: el mejor valor sigue siendo el que obtenías ignorando este ítem.
2. **Lo tomas**: "gastarás" su peso de la capacidad, pero añades su valor.

La solución óptima es el máximo entre ambas opciones.

**¿Por qué esto funciona?** Porque la propiedad de subestructura óptima garantiza:
- Si la solución óptima NO incluye el ítem $i$: esa solución es óptima para los primeros $i-1$ ítems con capacidad $w$.
- Si la solución óptima SÍ incluye el ítem $i$: la parte restante es óptima para los primeros $i-1$ ítems con capacidad $w - w_i$.

En ambos casos, los subproblemas son más pequeños y se resuelven óptimamente por inducción.

*(Fuente: CP4 §3.5.c — se demuestra que hay O(nS) estados solapados)*

### Definición formal

**Estado**: $\text{dp}[i][w]$ = máximo valor usando los primeros $i$ ítems con capacidad $\leq w$.

**Transición**:
$$\text{dp}[i][w] = \begin{cases} \text{dp}[i-1][w] & \text{si } w_i > w \text{ (no cabe)} \\ \max(\text{dp}[i-1][w],\ v_i + \text{dp}[i-1][w - w_i]) & \text{si } w_i \leq w \end{cases}$$

**Casos base**: $\text{dp}[0][w] = 0$ para todo $w$ (sin ítems, valor = 0).

**Respuesta**: $\text{dp}[n][S]$.

**Complejidad**: $O(nS)$ tiempo, $O(nS)$ espacio.

### Visualización de la tabla

Para el ejemplo anterior con $S=12$:

```
         w: 0  1  2  3  4  5  6  7  8  9 10 11 12
dp[0][w]:   0  0  0  0  0  0  0  0  0  0  0  0  0
dp[1][w]:   0  0  0  0  0  0  0  0  0  0 100 100 100  ← ítem 0 (p=10,v=100)
dp[2][w]:   0  0  0  0 70 70 70 70 70 70 100 100 100  ← ítem 1 (p=4,v=70)
dp[3][w]:   0  0  0  0 70 70 50 70 70 70 120 120 120  ← ítem 2 (p=6,v=50)
dp[4][w]:   0  0  0  0 70 70 50 70 70 70 120 120 120  ← ítem 3 (p=12,v=10)
```

La respuesta `dp[4][12] = 120`. ✓

### Implementación 2D (completa)

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAXN = 1005;
const int MAXS = 10005;

int n, S;
int v[MAXN], w[MAXN];   // valor y peso de cada ítem
int dp[MAXN][MAXS];     // dp[i][cap] = max valor con ítems 0..i-1 y capacidad cap

int main() {
    cin >> n >> S;
    for (int i = 1; i <= n; i++) cin >> v[i] >> w[i];
    
    // Casos base: dp[0][*] = 0 (ya inicializado globalmente)
    
    for (int i = 1; i <= n; i++) {           // para cada ítem
        for (int cap = 0; cap <= S; cap++) { // para cada capacidad
            dp[i][cap] = dp[i-1][cap];       // opción 1: no tomar ítem i
            if (w[i] <= cap) {               // si cabe
                dp[i][cap] = max(dp[i][cap], 
                                 v[i] + dp[i-1][cap - w[i]]); // opción 2: tomar
            }
        }
    }
    
    cout << dp[n][S] << "\n";
    return 0;
}
// Complejidad: O(n×S) tiempo, O(n×S) espacio
```

### Implementación Top-Down (para entender mejor)

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAXN = 1005;
const int MAXS = 10005;

int n, S;
int v[MAXN], w[MAXN];
int memo[MAXN][MAXS];

// dp(id, remW) = max valor usando ítems id..n-1 con capacidad restante remW
int dp(int id, int remW) {
    if (id == n || remW == 0) return 0;     // casos base
    int &ans = memo[id][remW];
    if (ans != -1) return ans;              // memoizado
    
    if (w[id] > remW)                       // no cabe
        return ans = dp(id + 1, remW);
    
    return ans = max(dp(id + 1, remW),      // no tomar
                     v[id] + dp(id + 1, remW - w[id])); // tomar
}

int main() {
    cin >> n >> S;
    for (int i = 0; i < n; i++) cin >> v[i] >> w[i];
    memset(memo, -1, sizeof memo);
    cout << dp(0, S) << "\n";
    return 0;
}
// Nota: Top-Down puede ser más rápido si muchos estados no son alcanzables (CP4 §3.5.c)
```

---

## Sección B: Optimización de Espacio a O(W)

### ¿Cuándo usarla?

Cuando $n \times S > 10^7$ (límite típico de memoria), pero $S \leq 10^4$ (puedes guardar solo una fila).

### La intuición

En la transición de Knapsack 0/1:
```
dp[i][cap] = max(dp[i-1][cap], v[i] + dp[i-1][cap - w[i]])
```

La fila $i$ solo depende de la fila $i-1$. Nunca necesitas filas más antiguas. Entonces puedes usar un solo array 1D y actualizarlo.

**La trampa crítica**: si actualizas de izquierda a derecha, `dp[cap - w[i]]` ya fue actualizado con el ítem actual → el mismo ítem podría tomarse múltiples veces (eso es Mochila ILIMITADA, no 0/1).

**La solución**: actualiza de **derecha a izquierda**. Así, cuando procesas `dp[cap]`, `dp[cap - w[i]]` todavía refleja el estado del ítem anterior.

```
Iteración izquierda→derecha: dp[cap] usa dp[cap-w] YA ACTUALIZADO → ítem tomado múltiples veces
Iteración derecha→izquierda: dp[cap] usa dp[cap-w] AÚN NO ACTUALIZADO → ítem tomado a lo más 1 vez
```

### Implementación 1D optimizada

```cpp
#include <bits/stdc++.h>
using namespace std;

int n, S;
int v[1005], w[1005];
int dp[10005]; // solo una fila

int main() {
    cin >> n >> S;
    for (int i = 0; i < n; i++) cin >> v[i] >> w[i];
    
    fill(dp, dp + S + 1, 0); // todos los valores inicializados en 0
    
    for (int i = 0; i < n; i++) {
        // CRÍTICO: recorrer de DERECHA a IZQUIERDA para Mochila 0/1
        for (int cap = S; cap >= w[i]; cap--) {
            dp[cap] = max(dp[cap], v[i] + dp[cap - w[i]]);
        }
        // Si fuera de izquierda a derecha → Mochila ILIMITADA
    }
    
    cout << dp[S] << "\n";
    return 0;
}
// Complejidad: O(n×S) tiempo, O(S) espacio
```

### Diagrama del proceso

```
Estado inicial: dp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                cap:  0  1  2  3  4  5  6  7  8  9 10 11 12

Procesando ítem 1 (w=4, v=70), recorriendo cap=12..4:
- cap=12: dp[12] = max(0, 70+dp[8]) = max(0,70) = 70
- cap=11: max(0,70+dp[7]) = 70
- ...
- cap=4:  max(0,70+dp[0]) = 70
- cap=3,2,1,0: no cambia (w[i]=4 > cap)
dp = [0, 0, 0, 0, 70, 70, 70, 70, 70, 70, 70, 70, 70]
```

---

## Sección C: Mochila Ilimitada (Unbounded Knapsack)

### El cambio conceptual

**Mochila 0/1**: cada ítem se puede tomar **a lo más una vez**.
**Mochila Ilimitada**: cada ítem se puede tomar **cualquier número de veces**.

### Ejemplo de motivación: Coin Change

"Tengo monedas de valores $c_1, c_2, \ldots, c_k$ con suministro ilimitado. ¿Cuántas monedas mínimas para hacer la suma $V$?"

Esto es exactamente Mochila Ilimitada donde:
- Valor de cada moneda = 1 (queremos minimizar el total)
- Peso de cada moneda = su valor nominal

*(Fuente: CPH Cap. 7.1 · CP4 §3.5.d)*

### La diferencia en la transición

**0/1**: al tomar el ítem $i$, el subproblema restante es para los mismos $i-1$ ítems anteriores.
$$\text{dp}[i][w] = \max(\text{dp}[i-1][w],\ v_i + \text{dp}[i-1][w-w_i])$$

**Ilimitada**: al tomar el ítem $i$, el subproblema restante todavía puede usar el mismo ítem $i$ nuevamente.
$$\text{dp}[w] = \max_{i: w_i \leq w}(v_i + \text{dp}[w - w_i])$$

La diferencia es sutil: en la versión ilimitada, el subproblema de capacidad $w - w_i$ todavía considera el ítem $i$.

### Implementación de Mochila Ilimitada

```cpp
// Mochila Ilimitada - Bottom Up
int dp[MAXS]; // dp[cap] = max valor con capacidad cap, ítems ilimitados

fill(dp, dp + S + 1, 0);

for (int cap = 0; cap <= S; cap++) {  // IZQUIERDA a DERECHA
    for (int i = 0; i < n; i++) {
        if (w[i] <= cap) {
            dp[cap] = max(dp[cap], v[i] + dp[cap - w[i]]);
        }
    }
}
// La clave: recorrer cap de IZQUIERDA a DERECHA
// Cuando procesamos dp[cap], dp[cap-w[i]] ya fue actualizado
// → el mismo ítem puede usarse múltiples veces ✓
```

### Coin Change con Mochila Ilimitada

```cpp
// Coin Change: mínimas monedas para suma V
// dp[v] = mínimas monedas para exactamente la suma v
const int INF = 1e9;
int dp[MAXV];
fill(dp, dp + V + 1, INF);
dp[0] = 0;  // 0 monedas para suma 0

for (int v = 1; v <= V; v++) {
    for (auto c : coins) {
        if (c <= v && dp[v-c] != INF) {
            dp[v] = min(dp[v], 1 + dp[v-c]);
        }
    }
}
// Respuesta: dp[V] (o "imposible" si dp[V] == INF)
// Complejidad: O(V × n_monedas)
// Fuente: CPH Cap. 7.1, CP4 §3.5.d
```

### ¿Por qué el orden de los loops importa?

```
ORDEN CORRECTO para Coin Change (ilimitada):
  for (suma v = 0 to V):       ← outer loop: suma objetivo
    for (moneda c in coins):   ← inner loop: moneda a usar
    
ORDEN ALTERNATIVO también correcto pero da OTRO resultado:
  for (moneda c in coins):     ← outer loop: tipo de moneda
    for (suma v = c to V):     ← inner loop: suma
    
El segundo orden cuenta COMBINACIONES (no permutaciones).
coins = {1, 3, 4}, V = 5:
- Primer orden: 3+1+1 y 1+3+1 y 1+1+3 se cuentan SEPARADAS (permutaciones)
- Segundo orden: 3+1+1 se cuenta UNA VEZ (combinación, importa el set, no el orden)
```

*(Este matiz es crítico en problemas de conteo. Ver `06_SUMAS_SUBCONJUNTOS.md`)*

---

## Sección D: Variantes de Mochila

### Variante 1: Mochila bidimensional (peso + volumen)

```
dp[i][w][vol] = max valor con primeros i ítems, peso ≤ w, volumen ≤ vol
Transición: dp[i][w][vol] = max(dp[i-1][w][vol], 
                                vi + dp[i-1][w-wi][vol-voli])
Complejidad: O(n × W × VOL)
```

### Variante 2: Exactamente K ítems

```
dp[i][k] = max valor usando exactamente k ítems de los primeros i
Transición: dp[i][k] = max(dp[i-1][k], vi + dp[i-1][k-1])
Casos base: dp[0][0] = 0, dp[0][k>0] = -INF (imposible)
```

### Variante 3: Al menos K ítems

Similar a la anterior, pero la respuesta es `max(dp[n][K], dp[n][K+1], ..., dp[n][n])`.

### Variante 4: Knapsack fraccionario (NO es DP)

Cuando puedes tomar fracciones de un ítem. La solución óptima es **Greedy**: ordenar por valor/peso descendente, tomar lo más valioso primero.

**¿Por qué Greedy funciona aquí?** Porque no hay restricción de integridad. Siempre puedes completar con fracción del siguiente ítem más valioso. La propiedad greedy sí se cumple.

**¿Por qué 0/1 NO es Greedy?** Porque al no poder tomar fracciones, puede ser mejor tomar dos ítems "menos eficientes" que uno muy eficiente.

*(Fuente: CP4 §3.5.c footnote 40)*

---

## Sección E: Debugging y trampas

### Trampa 1: Orden de iteración incorrecto (la más común)

```cpp
// ERROR: esto es Mochila ILIMITADA, no 0/1
for (int i = 0; i < n; i++) {
    for (int cap = w[i]; cap <= S; cap++) {  // ← izquierda a derecha = ILIMITADA
        dp[cap] = max(dp[cap], v[i] + dp[cap - w[i]]);
    }
}

// CORRECTO para 0/1:
for (int i = 0; i < n; i++) {
    for (int cap = S; cap >= w[i]; cap--) {  // ← derecha a izquierda = 0/1
        dp[cap] = max(dp[cap], v[i] + dp[cap - w[i]]);
    }
}
```

**Cómo detectarlo**: si el problema dice "cada ítem a lo más una vez" y tu solución usa el mismo ítem múltiples veces → orden incorrecto.

### Trampa 2: Confundir "0/1" con "ilimitada"

- **"Cada ítem tiene cantidad 1"** → 0/1 → derecha a izquierda
- **"Monedas con suministro ilimitado"** → ilimitada → izquierda a derecha
- **"Cada ítem tiene cantidad $k_i$"** → bounded knapsack → descomposición binaria

### Trampa 3: Inicialización incorrecta

```cpp
// Para MAXIMIZAR valor (Knapsack):
fill(dp, dp + S + 1, 0);  // correcto, 0 es el neutral para máximo sin ítems

// Para MINIMIZAR (Coin Change):
fill(dp, dp + V + 1, INF);  // correcto
dp[0] = 0;                   // caso base: 0 monedas para suma 0

// ERROR común: no inicializar dp[0] = 0 en Coin Change
// Resultado: dp[coin_value] = INF + 1 → overflow
```

### Trampa 4: Overflow en sumas

```cpp
// Si los valores son grandes y se suman:
long long dp[MAXS];  // usar long long si v[i] puede ser ~10^9

// Para conteo de formas (puede crecer exponencialmente):
const int MOD = 1e9 + 7;
dp[v] = (dp[v] + dp[v - c]) % MOD;
```

### Trampa 5: Capacidad muy grande

Si $S > 10^7$, la tabla DP no cabe en memoria. Considera:
- ¿Los pesos tienen estructura especial (son pocos valores distintos)?
- ¿Puedes usar Meet-in-the-Middle?
- ¿Es un problema diferente disfrazado?

### Checklist de debugging para Mochila

```
□ ¿Claramente entendí si es 0/1 o ilimitada?
□ ¿El orden del loop interno es correcto (derecha→izquierda para 0/1)?
□ ¿Inicialicé dp[0] = 0 correctamente?
□ ¿La respuesta está en dp[S] o en max(dp[0..S])?
□ ¿Probé con n=1, un solo ítem?
□ ¿Probé cuando ningún ítem cabe (todos w[i] > S)?
□ ¿Hay posible overflow en valor/peso?
```

### Ejemplo de debugging paso a paso

*Problema*: n=2, S=3, ítems: {(v=5, w=2), (v=4, w=3)}.
Respuesta esperada: dp[3] = 5 (solo ítem 0 cabe).

```
Inicialización: dp = [0, 0, 0, 0]

Ítem 0 (v=5, w=2), de cap=3 a cap=2:
- cap=3: dp[3] = max(dp[3], 5+dp[1]) = max(0, 5+0) = 5
- cap=2: dp[2] = max(dp[2], 5+dp[0]) = max(0, 5+0) = 5
dp = [0, 0, 5, 5]

Ítem 1 (v=4, w=3), de cap=3 a cap=3:
- cap=3: dp[3] = max(dp[3], 4+dp[0]) = max(5, 4+0) = 5
dp = [0, 0, 5, 5]

Respuesta: dp[3] = 5 ✓
```

---

**Referencias cruzadas**
- Ver `06_SUMAS_SUBCONJUNTOS.md` para Subset Sum (variante de decisión del Knapsack)
- Ver `09_TOP_DOWN_vs_BOTTOM_UP.md` para elegir implementación
- Ver `10_ERRORES_CONCEPTUALES.md` para errores conceptuales relacionados

*Fuentes: CP4 §3.5.c · CPH Cap. 7.4 · Rascó Galván §4.10*

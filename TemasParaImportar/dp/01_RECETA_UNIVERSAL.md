# 01. Receta Universal para Resolver Cualquier Problema DP

> *"La clave para dominar DP es la habilidad de determinar los estados del problema y las relaciones entre el problema actual y sus subproblemas."*  
> — CP4 §3.5

**Tabla de Contenidos**
- [Paso 1: ¿Es realmente DP?](#paso-1-es-realmente-dp)
- [Paso 2: Define el Estado](#paso-2-define-el-estado)
- [Paso 3: Define la Transición](#paso-3-define-la-transición)
- [Paso 4: Define los Casos Base](#paso-4-define-los-casos-base)
- [Paso 5: Elige Top-Down o Bottom-Up](#paso-5-elige-top-down-o-bottom-up)
- [Paso 6: Implementa y Verifica](#paso-6-implementa-y-verifica)
- [Paso 7: Optimiza si es necesario](#paso-7-optimiza-si-es-necesario)
- [Protocolo completo condensado](#protocolo-completo-condensado)

---

## Paso 1: ¿Es realmente DP?

### Las tres preguntas diagnósticas

Antes de escribir una sola línea de código, hazte estas tres preguntas:

**P1: ¿Qué pide el problema?**
- "Mínimo número de..." → probablemente DP
- "Máximo valor/cantidad..." → probablemente DP
- "¿Es posible...?" (decisión) → puede ser DP
- "¿Cuántas formas de...?" → casi seguro DP
- "Encuentra la subsecuencia más larga..." → DP clásico

**P2: ¿La solución bruta es exponencial o factorial?**
- Si enumerar todas las posibilidades es $O(2^n)$, $O(n!)$, o similar → DP puede ayudar
- Si la solución bruta ya es $O(n \log n)$ → probablemente no es DP

**P3: ¿Hay subproblemas que se repiten?**
- Escribe la recursión más natural para el problema
- ¿Aparece el mismo par de parámetros en ramas distintas del árbol de recursión?
- Si YES → DP es la técnica correcta

### Señales NO-DP

Algunos problemas parecen DP pero no lo son:
- **Greedy funciona**: si la "propiedad greedy" se puede demostrar (intercambio de argumentos), usa greedy.
- **Subproblemas independientes**: si los subproblemas no se solapan, usa Divide & Conquer.
- **Problema de decisión sobre grafo**: puede ser BFS/DFS, no DP.

### Ejemplo diagnóstico

*Problema*: dado un array $A$, encontrar el subarreglo contiguo de suma máxima.

- ¿Pide máximo? SÍ.
- ¿Solución bruta exponencial? No exactamente — hay $O(n^2)$ subarreglos.
- ¿Subproblemas solapados? SÍ — la suma de A[0..5] usa la de A[0..4].

→ ES DP (el algoritmo de Kadane).

---

## Paso 2: Define el Estado

### ¿Qué es un estado?

Un estado es un conjunto de parámetros que describen **unívocamente** un subproblema. 

**Definición formal** (Rascó, DP Handbook §2.1.1):
> Un estado es un conjunto de parámetros que expresan decisiones tomadas para formar una solución óptima. Deben tener la **mínima cantidad** de variaciones y elementos posible.

### Metodología para encontrar el estado correcto

**Pregunta 1**: ¿Qué información necesito para resolver el subproblema sin conocer el "futuro"?

Para Coin Change: necesito saber cuánto dinero me falta representar. Nada más.
→ Estado: `dp[v]` = mínimas monedas para suma $v$.

Para Knapsack 0/1: necesito saber qué ítem estoy considerando Y cuánta capacidad tengo.
→ Estado: `dp[i][w]` = máximo valor usando primeros $i$ ítems con capacidad $w$.

Para LCS: necesito saber hasta qué posición llegué en ambas cadenas.
→ Estado: `dp[i][j]` = longitud de LCS de `A[0..i]` y `B[0..j]`.

**Pregunta 2**: ¿Mi estado contiene información redundante?

Si el estado tiene parámetros que no afectan la respuesta, la tabla es más grande de lo necesario → TLE/MLE.

**Pregunta 3**: ¿Mi estado omite información necesaria?

Si dos situaciones distintas producen el mismo estado pero deberían tener respuestas distintas → el estado es incompleto → WA.

### Tabla de patrones de estados comunes

| Tipo de problema | Estado típico | Semántica |
|-----------------|---------------|-----------|
| Array lineal | `dp[i]` | Solución para prefijo/sufijo A[0..i] |
| Dos arrays/strings | `dp[i][j]` | Solución para A[0..i] y B[0..j] |
| Partición | `dp[i][j]` | Solución para rango A[i..j] |
| Mochila | `dp[i][w]` | Ítems 0..i, capacidad w |
| Con conjunto | `dp[mask]` | Subconjunto representado por bitmask |
| Árbol | `dp[nodo][estado]` | Subtree enraizado en nodo |
| Counting | `dp[i]` | Número de formas de llegar al estado i |

### Código de ejemplo: definición de estado

```cpp
// ESTADO PARA COIN CHANGE
// dp[v] = mínimas monedas para hacer exactamente la suma v
int dp[MAXV]; 
// Semántica clara: dp[7] = 2 significa que 7 se puede hacer con 2 monedas mínimo

// ESTADO PARA KNAPSACK
// dp[i][w] = máximo valor usando ítems 0..i-1 con capacidad exactamente w
int dp[MAXN][MAXW];
// dp[3][10] = 45 significa: usando los primeros 3 ítems, capacidad 10, valor máximo es 45
```

---

## Paso 3: Define la Transición

### ¿Qué es la transición?

La transición es la ecuación que relaciona `dp[estado_actual]` con `dp[estados_previos]`. Es el corazón matemático de la solución.

### Metodología para encontrar la transición

**Pregunta clave**: en el último paso para resolver el estado actual, ¿qué opciones tengo?

Para cada opción, determina:
1. ¿Qué costo tiene esta opción?
2. ¿A qué estado previo me lleva?
3. ¿Quiero el mínimo, máximo, o suma sobre todas las opciones?

### Tipos de transición

**Tipo 1: Tomar o no tomar** (Knapsack, Subset Sum)
```
dp[i][w] = max(
    dp[i-1][w],           // No tomo ítem i
    dp[i-1][w-peso[i]] + valor[i]  // Tomo ítem i (si peso[i] <= w)
)
```

**Tipo 2: Elegir el mejor de todos** (Coin Change, Rod Cutting)
```
dp[v] = min over all coins c:
    1 + dp[v - c]    // uso moneda c, queda v-c por representar
```

**Tipo 3: Combinar todos** (Counting, Paths)
```
dp[i][j] = dp[i-1][j] + dp[i][j-1]    // suma de todas las formas de llegar
```

**Tipo 4: Dividir en subintervalos** (Interval DP)
```
dp[i][j] = min over all k in [i+1, j]:
    dp[i][k-1] + dp[k][j] + costo(i, j)
```

**Tipo 5: Comparar caracteres** (LCS, Edit Distance)
```
if A[i] == B[j]:
    dp[i][j] = 1 + dp[i-1][j-1]
else:
    dp[i][j] = max(dp[i-1][j], dp[i][j-1])
```

### Ejemplo trabajado: encontrar la transición de LIS

*Problema*: Longest Increasing Subsequence.

Estado: `dp[i]` = longitud de la LIS que **termina exactamente en** el índice $i$.

*¿Qué opciones tengo en el último paso?*

Para construir la LIS que termina en $i$, puedo:
- Empezar con solo `A[i]` (longitud 1, el mínimo)
- O extender alguna LIS anterior que terminaba en $j < i$ con `A[j] < A[i]`

$$\text{dp}[i] = \max\left(1, \max_{j < i, A[j] < A[i]} (\text{dp}[j] + 1)\right)$$

La respuesta final: $\max_k \text{dp}[k]$ para todo $k$.

*(Fuente: CPH Cap. 7.2 · CP4 §3.5.b)*

---

## Paso 4: Define los Casos Base

### ¿Por qué los casos base importan tanto?

Los casos base son la "piedra angular" de toda la solución DP. Si los inicializas mal, la tabla entera será incorrecta. No hay forma de detectar esto solo mirando el código — solo se ve en casos de prueba pequeños.

### Tipos de casos base

**Tipo 1: Subproblema vacío**
```
dp[0] = 0    // suma 0 requiere 0 monedas
dp[0][*] = 0 // con 0 ítems, valor máximo es 0
```

**Tipo 2: Caso trivial**
```
dp[i][i] = 0    // intervalo de un solo elemento
dp[i][0] = i    // string de longitud i vs string vacío: i borrados
dp[0][j] = j    // string vacío vs string de longitud j: j inserciones
```

**Tipo 3: Imposible / infinito**
```
dp[v] = INF     // para v > 0 antes de calcular (imposible hacer esa suma)
dp[i][j] = -INF // valor máximo imposible antes de calcular
```

### Regla crítica: inicialización

```cpp
// Para mínimos (Coin Change, Edit Distance):
fill(dp, dp + MAXV, INF);  // o 1e9
dp[0] = 0;                 // caso base

// Para máximos (Knapsack, LIS):
fill(dp, dp + N, 0);       // o -INF si los valores pueden ser negativos
// No necesitas caso base explícito si el loop lo maneja

// Para conteo (Paths, Counting):
fill(dp, dp + N, 0);
dp[0] = 1;                 // hay exactamente 1 forma de llegar al inicio
```

### Trampa clásica: INF y overflow

```cpp
// MAL: INF + 1 puede overflow si INF = INT_MAX
dp[v] = min(dp[v], dp[v-c] + 1);   // si dp[v-c] = INT_MAX, INT_MAX + 1 = overflow!

// BIEN: usar 1e9 como INF en lugar de INT_MAX
const int INF = 1e9;
dp[v] = min(dp[v], dp[v-c] + 1);   // 1e9 + 1 es fine, mucho menor que INT_MAX
```

---

## Paso 5: Elige Top-Down o Bottom-Up

Ver `09_TOP_DOWN_vs_BOTTOM_UP.md` para análisis completo.

**Regla rápida para concursos**:

```
¿El espacio de estados es denso (casi todos los estados son alcanzados)?
  → Bottom-Up

¿El espacio de estados es disperso (muchos estados nunca se alcanzan)?
  → Top-Down

¿Tienes dudas?
  → Top-Down primero (más fácil de implementar), optimizar si TLE
```

---

## Paso 6: Implementa y Verifica

### Checklist de implementación

**Antes de codificar**:
- [ ] ¿Definí el estado con semántica clara (en una oración)?
- [ ] ¿Escribí la transición matemáticamente?
- [ ] ¿Identifiqué TODOS los casos base?
- [ ] ¿Sé el orden de llenado de la tabla (Bottom-Up)?

**Durante la codificación**:
- [ ] ¿El tipo de dato es correcto? (`int` vs `long long` vs `double`)
- [ ] ¿Inicialicé correctamente los valores imposibles (`INF` vs `0`)?
- [ ] ¿El orden de los loops procesa dependencias en el orden correcto?

**Después de codificar**:
- [ ] Prueba con $N=1$ (caso mínimo)
- [ ] Prueba con el ejemplo del enunciado
- [ ] Prueba con un caso donde la respuesta sea 0 o imposible
- [ ] Prueba con valores máximos (desbordamiento)

### Estrategia de debugging DP

Si el código da WA:

```
1. Imprime la tabla DP completa para un caso pequeño (N=3-5)
2. Verifica manualmente celda por celda que los valores son correctos
3. El primer valor incorrecto indica dónde está el bug:
   - Si es un caso base: revisa la inicialización
   - Si es una transición: revisa la fórmula
   - Si es solo al final: revisa cómo calculas la respuesta final desde la tabla
```

### Código template: Bottom-Up

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAXN = 1005;
const int INF = 1e9;

int n;
int A[MAXN];  // datos del problema
int dp[MAXN]; // tabla DP

int main() {
    cin >> n;
    for (int i = 0; i < n; i++) cin >> A[i];
    
    // Paso 4: Inicializar casos base
    fill(dp, dp + n + 1, INF);  // o 0, dependiendo del problema
    dp[0] = 0;                   // caso base típico
    
    // Paso 3: Aplicar transición (orden correcto de loops)
    for (int i = 1; i <= n; i++) {
        for (/* opciones */) {
            dp[i] = min(dp[i], /* transición */);
        }
    }
    
    // Respuesta final
    cout << dp[n] << "\n";
    return 0;
}
```

### Código template: Top-Down

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAXN = 1005;
const int INF = 1e9;

int n;
int A[MAXN];
int memo[MAXN];
bool computed[MAXN];  // o usar -1 como sentinel

int dp(int i) {
    // Paso 4: Casos base
    if (i == 0) return 0;
    
    // Memoización
    if (computed[i]) return memo[i];
    computed[i] = true;
    
    // Paso 3: Transición
    int ans = INF;
    for (/* opciones */) {
        ans = min(ans, /* transición */);
    }
    
    return memo[i] = ans;
}

int main() {
    cin >> n;
    for (int i = 0; i < n; i++) cin >> A[i];
    
    // Inicializar memoización
    memset(computed, false, sizeof(computed));
    
    cout << dp(n) << "\n";
    return 0;
}
```

---

## Paso 7: Optimiza si es necesario

### Optimizaciones comunes

**Optimización de espacio** (cuando solo necesitas la fila anterior):

```cpp
// En lugar de dp[n][W], usa solo dp[W] con loop de derecha a izquierda
// Ver 02_MOCHILA.md para detalle completo
```

**Reducción de dimensiones**: si el estado tiene información redundante, elimínala.

**Técnicas avanzadas**: si TLE persiste después de la optimización estándar, considera:
- Convex Hull Trick (ver `08_OPTIMIZACIONES.md`)
- Divide & Conquer DP (ver `08_OPTIMIZACIONES.md`)
- Monotone Queue (ver `08_OPTIMIZACIONES.md`)

---

## Protocolo completo condensado

Cuando enfrentes un problema DP en concurso, sigue este protocolo exacto:

```
⏱️ MINUTO 0-5: DIAGNÓSTICO
□ ¿Pide min/max/contar? → candidato DP
□ ¿Brute force es exponencial? → confirma DP
□ ¿Subproblemas se repiten? → DP es correcto

⏱️ MINUTO 5-15: DISEÑO
□ Escribe el estado: dp[...] = "..."
□ Escribe la transición matemáticamente: dp[i] = f(dp[...])
□ Escribe los casos base: dp[0] = ..., dp[base] = ...
□ Estima la complejidad: |estados| × |costo transición| ≤ 10^8?

⏱️ MINUTO 15-30: IMPLEMENTACIÓN
□ Elige Top-Down o Bottom-Up
□ Implementa con el template correspondiente
□ Verifica con el ejemplo del enunciado

⏱️ MINUTO 30-45: DEBUGGING (si hay WA)
□ Prueba N=1, N=2
□ Imprime tabla DP para N pequeño
□ Encuentra la primera celda incorrecta
□ Corrige inicialización o transición
```

---

## Errores comunes en esta etapa

**Error: Saltar directo a codificar sin diseñar el estado**
- Síntoma: código que "parece correcto" pero da WA
- Fix: escribe el estado y la transición en papel antes de codificar

**Error: Transición incompleta — no enumerar todas las opciones**
- Síntoma: WA en casos donde la opción correcta es la que olvidaste
- Fix: pregunta "¿cuáles son TODAS las opciones en este paso?" y enuméralas todas

**Error: Loop order incorrecto en Bottom-Up**
- Síntoma: la transición usa un valor que aún no fue calculado
- Fix: dibuja las dependencias y asegúrate que el loop las respeta

---

**Referencias cruzadas**
- Ver `00_INTRODUCCION.md` para fundamentos de DP
- Ver `09_TOP_DOWN_vs_BOTTOM_UP.md` para el Paso 5 en detalle
- Ver `02_MOCHILA.md` para aplicar esta receta al primer patrón
- Ver `10_ERRORES_CONCEPTUALES.md` para errores avanzados

*Fuentes: CP4 §3.5 · CPH Cap. 7 · Rascó Galván, Cap. 3*

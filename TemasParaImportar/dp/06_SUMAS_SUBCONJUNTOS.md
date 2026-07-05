# 06. Sumas de Subconjuntos: Subset Sum, Partition, Coin Change

> *"Subset Sum es la versión binaria del Knapsack: misma estructura, restricción de decisión."*

**Tabla de Contenidos**
- [Sección A: Subset Sum — Decisión](#sección-a-subset-sum--decisión)
- [Sección B: Subset Sum Counting — ¿Cuántas formas?](#sección-b-subset-sum-counting--cuántas-formas)
- [Sección C: Partition Problem](#sección-c-partition-problem)
- [Sección D: Coin Change y variantes](#sección-d-coin-change-y-variantes)
- [Sección E: Target Sum con signos](#sección-e-target-sum-con-signos)
- [Sección F: Debugging y trampas](#sección-f-debugging-y-trampas)

---

## Sección A: Subset Sum — Decisión

### Enunciado

Dado un array $A$ de $n$ enteros positivos y un objetivo $S$: **¿existe un subconjunto de $A$ con suma exactamente $S$?**

**Ejemplo**:
```
A = {3, 1, 4, 1, 5}, S = 9
Subconjunto {3, 1, 5} → suma 9 → SÍ ✓
```

### Conexión con Knapsack

Subset Sum es exactamente Knapsack 0/1 donde:
- El "valor" de cada ítem = su peso (ambos iguales al número)
- La capacidad $S$ = el objetivo
- La pregunta es: ¿se puede alcanzar EXACTAMENTE $S$? (no solo ≤ S)

### Estado y transición

**Estado**: $\text{dp}[i][s]$ = ¿es posible formar la suma $s$ usando los primeros $i$ elementos?

**Transición** (CPH Cap. 7.4):
$$\text{dp}[i][s] = \text{dp}[i-1][s] \lor \text{dp}[i-1][s - A[i-1]]$$

- $\text{dp}[i-1][s]$: no uso el elemento $i$, y ya podía hacer la suma $s$.
- $\text{dp}[i-1][s - A[i-1]]$: uso el elemento $i$, y podía hacer la suma $s - A[i]$.

**Casos base**: $\text{dp}[0][0] = \text{true}$ (suma 0 siempre es posible), $\text{dp}[0][s > 0] = \text{false}$.

**Respuesta**: $\text{dp}[n][S]$.

### Implementación 2D

```cpp
bool subset_sum(vector<int>& A, int S) {
    int n = A.size();
    vector<vector<bool>> dp(n+1, vector<bool>(S+1, false));
    
    dp[0][0] = true;  // caso base: suma 0 siempre alcanzable
    
    for (int i = 1; i <= n; i++) {
        for (int s = 0; s <= S; s++) {
            dp[i][s] = dp[i-1][s];  // no tomar A[i-1]
            if (s >= A[i-1] && dp[i-1][s - A[i-1]])
                dp[i][s] = true;    // tomar A[i-1]
        }
    }
    
    return dp[n][S];
}
```

### Implementación 1D optimizada (CPH Cap. 7.4)

CPH presenta este como la implementación "mejor":

```cpp
bool subset_sum_1d(vector<int>& A, int S) {
    vector<bool> dp(S+1, false);
    dp[0] = true;
    
    for (int k = 0; k < A.size(); k++) {
        // Recorrer de DERECHA a IZQUIERDA (igual que Knapsack 0/1)
        for (int s = S; s >= A[k]; s--) {
            if (dp[s - A[k]])
                dp[s] = true;
        }
    }
    
    return dp[S];
}
// Complejidad: O(n × S) tiempo, O(S) espacio
// Fuente: CPH Cap. 7.4
```

### Visualización del proceso

```
A = {1, 3, 3, 5}, S = 12
(tabla CPH Cap. 7.4 — X = true)

k\s  0  1  2  3  4  5  6  7  8  9 10 11 12
0    X
1    X  X
2    X  X     X  X
3    X  X     X  X     X  X
4    X  X     X  X  X  X  X  X  X  X     X

dp[12] = false: la suma 12 NO es alcanzable con {1,3,3,5}
```

---

## Sección B: Subset Sum Counting — ¿Cuántas formas?

### Cambio conceptual

En vez de `bool dp[s]` (¿es posible?), usamos `int dp[s]` (¿cuántas formas de hacer la suma $s$?).

La transición cambia de `OR` a `suma`:

$$\text{dp}[s] += \text{dp}[s - A[k]]$$

```cpp
int count_subset_sum(vector<int>& A, int S) {
    vector<int> dp(S+1, 0);
    dp[0] = 1;  // hay exactamente 1 forma de hacer suma 0 (subconjunto vacío)
    
    for (int k = 0; k < A.size(); k++) {
        for (int s = S; s >= A[k]; s--) {  // derecha a izquierda = 0/1
            dp[s] += dp[s - A[k]];
        }
    }
    
    return dp[S];
}
// Complejidad: O(n × S)
// CUIDADO: los números pueden crecer enormemente → usar long long o MOD
```

### ¿Cuándo usar módulo?

Si el problema dice "calcular el número de formas módulo $10^9 + 7$":
```cpp
const int MOD = 1e9 + 7;
dp[s] = (dp[s] + dp[s - A[k]]) % MOD;
```

---

## Sección C: Partition Problem

### Enunciado

¿Puedes dividir el array $A$ en dos subconjuntos con **suma igual**?

### Reducción a Subset Sum

La suma total es $T = \sum A_i$. Para que la partición sea posible:
1. $T$ debe ser par (si es impar, imposible).
2. ¿Existe un subconjunto con suma exactamente $T/2$?

```cpp
bool can_partition(vector<int>& A) {
    int total = 0;
    for (int x : A) total += x;
    
    if (total % 2 != 0) return false;  // suma impar: imposible
    
    int target = total / 2;
    return subset_sum_1d(A, target);   // ¿hay subconjunto con suma target?
}
```

**¿Por qué funciona?** Si existe subconjunto con suma $T/2$, el complemento también tiene suma $T/2$. Ambas mitades son iguales.

---

## Sección D: Coin Change y variantes

### Variant 1: Mínimas monedas (Coin Change básico)

Ver `02_MOCHILA.md` Sección C para la implementación completa.

```cpp
// dp[v] = mínimas monedas para suma v
const int INF = 1e9;
vector<int> dp(V+1, INF);
dp[0] = 0;
for (int v = 1; v <= V; v++)
    for (int c : coins)
        if (c <= v && dp[v-c] != INF)
            dp[v] = min(dp[v], 1 + dp[v-c]);
```

### Variant 2: Contar formas de hacer suma V

*(Diferente del Knapsack de conteo — aquí el orden puede importar)*

**Opción A: Combinaciones** (el conjunto importa, no el orden)
```
Coins = {1,2,3}, V = 4
{1,3}, {1,1,2}, {2,2}, {1,1,1,1} → 4 combinaciones
```

```cpp
// Iterar coins en outer loop = contar combinaciones (sets)
vector<long long> dp(V+1, 0);
dp[0] = 1;
for (int c : coins) {           // outer: tipo de moneda
    for (int v = c; v <= V; v++) {  // inner: suma
        dp[v] += dp[v-c];
    }
}
// dp[V] = número de formas como COMBINACIÓN (sin importar orden)
// Fuente: CPH Cap. 7.1 (counting variant)
```

**Opción B: Permutaciones** (el orden importa)
```
Coins = {1,2,3}, V = 4
{1,3}, {3,1}, {2,2}, {1,1,2}, {1,2,1}, {2,1,1}, {1,1,1,1} → más formas
```

```cpp
// Iterar suma en outer loop = contar permutaciones (sequences)
vector<long long> dp(V+1, 0);
dp[0] = 1;
for (int v = 1; v <= V; v++) {  // outer: suma objetivo
    for (int c : coins) {           // inner: moneda usada
        if (c <= v) dp[v] += dp[v-c];
    }
}
// dp[V] = número de SECUENCIAS (el orden importa)
```

**La diferencia crítica** (CP4 §3.5.d):
```
Outer = monedas: cada moneda usada en su "turno" → no hay doble conteo de sets
Outer = suma:    para cada suma, pruebo todas las monedas → cuenta secuencias distintas
```

### Variant 3: ¿Puede hacerse exactamente la suma V?

```cpp
// dp[v] = true si es posible hacer exactamente la suma v
vector<bool> dp(V+1, false);
dp[0] = true;
for (int v = 1; v <= V; v++)
    for (int c : coins)
        if (c <= v && dp[v-c])
            dp[v] = true;
```

---

## Sección E: Target Sum con signos

### Enunciado (típico en Codeforces)

Dado un array $A$ y un objetivo $T$: asigna a cada elemento un signo $+$ o $-$. ¿Puedes hacer que la suma total sea $T$?

### Reducción

Sea $P$ = suma de elementos con signo $+$, $N$ = suma de elementos con signo $-$.
- $P + N = \text{suma\_total}$
- $P - N = T$
- $\Rightarrow P = (\text{suma\_total} + T) / 2$

Si $(\text{suma\_total} + T)$ es par y $\geq 0$: cuenta subconjuntos con suma $P$.

```cpp
int find_target_sum(vector<int>& A, int T) {
    int total = 0;
    for (int x : A) total += x;
    
    int target = total + T;
    if (target < 0 || target % 2 != 0) return 0;
    target /= 2;
    
    return count_subset_sum(A, target);
}
```

---

## Sección F: Debugging y trampas

### Trampa 1: Suma muy grande

Si $S > 10^6$ y $n$ es grande, el array `dp[S]` puede ser demasiado grande o $O(nS)$ muy lento.

Considera: ¿los elementos tienen estructura especial? ¿Puedes comprimir?

### Trampa 2: Orden de loops para conteo

```
¿Quiero CONJUNTOS (sets sin importar orden)?
  → coins en outer loop, suma en inner loop

¿Quiero SECUENCIAS (orden importa)?
  → suma en outer loop, coins en inner loop
```

### Trampa 3: dp[0] = 1 vs dp[0] = 0

```cpp
// Para CONTEO (cuántas formas):
dp[0] = 1;  // hay 1 forma de hacer suma 0: no usar ningún elemento

// Para DECISION (¿es posible?):
dp[0] = true;

// Para MINIMIZAR (mínimas operaciones):
dp[0] = 0;  // 0 operaciones para suma 0
```

### Trampa 4: Elementos duplicados en Partition

Si el array tiene elementos iguales, no hay problema — se tratan como elementos distintos (posición diferente en el array).

### Checklist de debugging

```
□ ¿Inicialicé dp[0] correctamente (0, 1, o true)?
□ ¿El orden de loops es correcto para el tipo de conteo deseado?
□ ¿Recorro de derecha a izquierda para 0/1 (elementos usados a lo más 1 vez)?
□ ¿Verifiqué paridad en Partition antes de llamar a Subset Sum?
□ ¿Probé con el subconjunto vacío (suma = 0)?
□ ¿Hay posible overflow en los conteos?
```

---

**Referencias cruzadas**
- Ver `02_MOCHILA.md` para la versión completa de Coin Change y Knapsack
- Ver `07_CONTEO_COMBINATORIOS.md` para más problemas de conteo
- Ver `10_ERRORES_CONCEPTUALES.md` para errores sobre orden de conteo

*Fuentes: CPH Cap. 7.1, 7.4 · CP4 §3.5.c, 3.5.d · Rascó Galván §4.10, 4.11*

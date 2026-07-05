# 11. Casos Edge y Debugging Sistemático

> *"La diferencia entre 90 puntos y 100 puntos en un concurso casi siempre son los casos edge."*

**Tabla de Contenidos**
- [Sección A: Metodología de debugging DP](#sección-a-metodología-de-debugging-dp)
- [Sección B: Casos edge universales](#sección-b-casos-edge-universales)
- [Sección C: Casos edge por patrón](#sección-c-casos-edge-por-patrón)
- [Sección D: Protocolo de testing en concurso](#sección-d-protocolo-de-testing-en-concurso)

---

## Sección A: Metodología de debugging DP

### El proceso cuando recibes WA

```
1. REPRODUCE el caso que falla (si el juez da feedback)
2. IMPRIME la tabla DP completa para un caso pequeño (N=3-5)
3. VERIFICA manualmente celda por celda
4. El PRIMER valor incorrecto revela dónde está el bug:
   - ¿Es un caso base? → error en inicialización
   - ¿Es una transición? → error en la fórmula
   - ¿Es la respuesta final? → error en cómo extraes dp[resultado]
```

### Cómo imprimir la tabla DP para debugging

```cpp
// Agregar temporalmente al código para ver la tabla
void print_dp(int** dp, int n, int m) {
    for (int i = 0; i <= n; i++) {
        for (int j = 0; j <= m; j++) {
            printf("%4d", dp[i][j]);
        }
        printf("\n");
    }
}

// Para verificar contra valores calculados manualmente
```

### Casos de prueba mínimos que debes ejecutar SIEMPRE

```
□ N = 1: caso mínimo, respuesta debería ser trivial
□ N = 2: primer caso no-trivial, verifica la transición básica
□ El ejemplo del enunciado (obvio, pero se olvida)
□ Caso donde la respuesta es 0 o imposible
□ Caso donde toda la solución es viable (respuesta = máximo posible)
□ Todos los elementos iguales
□ Elementos en orden extremo (ya ordenados, ordenados al revés)
```

---

## Sección B: Casos edge universales

### Edge 1: N = 0 o array vacío

```cpp
// ¿Qué pasa si no hay ítems?
// Knapsack: dp[0][w] = 0 ← debe inicializarse correctamente
// LCS: dp[0][j] = 0 y dp[i][0] = 0 ← casos base, cubren esto
// Coin Change: dp[0] = 0 ← base case

// ERROR COMÚN: acceder a A[0] cuando n = 0
if (n == 0) { cout << 0; return 0; }  // guardia defensiva
```

### Edge 2: Capacidad/Objetivo = 0

```cpp
// Knapsack con S = 0: no cabe nada, respuesta = 0
// dp[*][0] = 0 ← debe estar inicializado
// Coin Change con V = 0: dp[0] = 0 (caso base explícito)
// Subset Sum con S = 0: dp[0] = true (subconjunto vacío)

// Verifica: ¿tu inicialización cubre S = 0 y V = 0 correctamente?
```

### Edge 3: Un solo elemento

```cpp
// Knapsack: si n=1, la respuesta es v[0] si w[0] <= S, sino 0
// LCS: si A tiene 1 caracter y B tiene 1 caracter, resultado es 0 o 1
// LIS: si n=1, la LIS tiene longitud 1

// Si tu código falla con n=1, probablemente hay un error en la inicialización
// o en el primer paso del loop
```

### Edge 4: Restricción mayor que la suma total

```cpp
// Knapsack con S > suma_de_todos_los_pesos:
// → deberías poder tomar todos los ítems
// → respuesta = suma de todos los valores

// Verifica que dp[n][S] = suma total de valores en este caso
```

### Edge 5: Valores negativos (si el problema los permite)

```cpp
// Si A puede contener negativos, algunas soluciones DP cambian:
// LIS: ¿puede una LIS incluir negativos? Sí, si son crecientes
// Max Subarray (Kadane): la lógica de resetear a 0 puede cambiar si todos son negativos
//   → si todos son negativos, la respuesta es el mayor elemento (no 0)

// Verifica el caso: todos los elementos son negativos
int A[] = {-5, -3, -8, -1};
// Kadane debería retornar -1 (no 0)

// Fix para Kadane con todos negativos:
int sum = A[0], ans = A[0];
for (int i = 1; i < n; i++) {
    sum = max(A[i], sum + A[i]);  // diferente: no resetea a 0, sino al elemento mismo
    ans = max(ans, sum);
}
```

### Edge 6: Desbordamiento de índices

```cpp
// En Edit Distance con i=0 o j=0:
// dp[-1][j] no existe → usar 1-indexed o manejar con cuidado

// En LCS con i=-1:
// if (i < 0 || j < 0) return 0;  // guardia

// En LIS accediendo A[n]:
// El sentinel A[n] = INF no debe accederse si n es el tamaño real del array
```

### Edge 7: La respuesta no está en dp[n][S] sino en un máximo sobre varios estados

```cpp
// LIS: la respuesta es max(dp[0], dp[1], ..., dp[n-1]), NO dp[n-1]
int ans = *max_element(dp, dp + n);

// Kadane: la respuesta se actualiza en cada paso, no está en dp[n]
int ans = 0;
for (int i = 0; i < n; i++) {
    sum += A[i];
    ans = max(ans, sum);
    if (sum < 0) sum = 0;
}

// Max Submatrix: la respuesta es el máximo sobre todos los pares (l, r)
// Asegúrate de actualizar ans dentro del loop correcto
```

### Edge 8: Subproblemas imposibles que no se marcan como INF

```cpp
// Coin Change: si dp[v] == INF, significa que la suma v es imposible
// ERROR: no verificar esto antes de usarlo
dp[v] = min(dp[v], 1 + dp[v-c]);  // si dp[v-c] = INF, entonces INF+1 = overflow!

// CORRECTO:
if (dp[v-c] != INF)
    dp[v] = min(dp[v], 1 + dp[v-c]);
// O usa INF = 1e9 en lugar de INT_MAX para que INF+1 no desborde
```

---

## Sección C: Casos edge por patrón

### Knapsack / Subset Sum

```
□ S = 0 (nada puede caber)
□ n = 0 (sin ítems)
□ n = 1 (un solo ítem)
□ Todos los pesos > S (no cabe nada)
□ Suma total de pesos < S (caben todos)
□ Un ítem con peso exactamente S (debe tomarse)
□ Todos los ítems idénticos
```

### LCS / Edit Distance

```
□ Una de las strings es vacía (respuesta = 0 o len(otra))
□ Strings idénticas (LCS = longitud, Edit = 0)
□ Sin ningún carácter en común (LCS = 0, Edit = m + n)
□ Una string es subsecuencia de la otra
□ Strings de longitud 1
□ Strings muy largas (verificar complejidad, ¿hay TLE?)
```

### LIS

```
□ Array ya ordenado de forma creciente (LIS = n)
□ Array ordenado de forma decreciente (LIS = 1)
□ Todos los elementos iguales (LIS = 1 si estricto, = n si no-decreciente)
□ Array de longitud 1 (LIS = 1)
□ Elemento negativo mínimo al inicio (¿se incluye correctamente?)
```

### Interval DP

```
□ n = 1 (intervalo trivial, dp[0][0] = 0)
□ n = 2 (primera transición con k único)
□ Todos los elementos iguales
□ Costo muy grande que puede causar overflow
```

### Tree DP

```
□ Árbol de un solo nodo (raíz = hoja)
□ Árbol lineal (cadena): profundidad = n (¿stack overflow?)
□ Árbol estrella (raíz conectada a todos los demás)
□ Árbol perfectamente balanceado
```

---

## Sección D: Protocolo de testing en concurso

### Los 5 minutos antes de enviar

```
1. (1 min) Ejecuta el ejemplo del enunciado → ¿correcto?
2. (1 min) Prueba N=1 (o el caso mínimo posible)
3. (1 min) Prueba un caso donde la respuesta sea 0 o imposible
4. (1 min) Revisa: ¿hay overflow? (long long, INF = 1e9, módulo)
5. (1 min) Revisa: ¿el orden de loops es correcto? (derecha→izq para 0/1)
```

### Señales de alerta antes de enviar

```
⚠️  La respuesta para el ejemplo es correcta pero con N grande da TLE → complejidad incorrecta
⚠️  El código usa INT_MAX como INF → posible overflow
⚠️  La tabla DP está declarada globalmente pero no se reinicializa entre casos → contaminación
⚠️  Los loops de Bottom-Up van de izquierda a derecha en Knapsack 0/1
⚠️  No hay manejo del caso donde la suma es imposible (dp[V] = INF al final)
```

### Reinicialización entre casos de prueba

```cpp
// Muchos problemas tienen múltiples casos de prueba (T casos)
// DEBES reinicializar la tabla entre cada caso

int main() {
    int T; cin >> T;
    while (T--) {
        // Opción A: fill/memset antes de cada caso
        fill(dp, dp + MAXN, 0);  // o INF, dependiendo del problema
        
        // Opción B: si la tabla es grande, declarar como local (pero más lento)
        // vector<int> dp(n+1, 0);
        
        // leer input y resolver...
    }
}
```

---

**Referencias cruzadas**
- Ver `10_ERRORES_CONCEPTUALES.md` para errores de diseño
- Ver `01_RECETA_UNIVERSAL.md` para el protocolo pre-implementación
- Ver `12_CHEAT_SHEET.md` para la referencia rápida de concurso

*Fuentes: experiencia en ICPC*

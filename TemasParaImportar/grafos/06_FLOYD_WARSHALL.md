---
titulo: "Floyd-Warshall — Todos los Pares de Distancias"
tipo: icpc-tema
categoria: grafos
estado: en-progreso
etiquetas: [icpc, icpc/tema, icpc/categoria/grafos]
fuente-cph: "Cap. 13"
fuente-cp4: "§4.5"
creado: 2026-04-17
actualizado: 2026-04-17
---

# Floyd-Warshall — Todos los Pares de Distancias

> CPH Cap. 13 | CP4 §4.5 | CPA: floyd-warshall

Floyd-Warshall calcula las distancias mínimas entre **todos los pares** de nodos en $O(N^3)$. Soporta pesos negativos y detecta ciclos negativos. Útil cuando N ≤ 500.

---

## 1. Intuición Profunda

### La Pregunta Fundamental

Para cada par $(i, j)$, Floyd-Warshall pregunta:

> "¿Es mejor ir directamente de $i$ a $j$, o pasar por algún nodo intermedio $k$?"

Si pasamos por $k$: costo = `dist[i][k] + dist[k][j]`

### Formulación de Programación Dinámica

Definamos:

$$dp[k][i][j] = \text{distancia mínima de } i \text{ a } j \text{ usando solo nodos } \{0, 1, \ldots, k\} \text{ como intermedios}$$

**Caso base** ($k = -1$, sin intermedios):
$$dp[-1][i][j] = \begin{cases} 0 & \text{si } i = j \\ w(i,j) & \text{si existe arista } (i,j) \\ \infty & \text{en otro caso} \end{cases}$$

**Transición:**
$$dp[k][i][j] = \min(dp[k-1][i][j], \; dp[k-1][i][k] + dp[k-1][k][j])$$

Interpretación: el mejor camino usando nodos $\{0,\ldots,k\}$ es:
- O no pasa por $k$ → `dp[k-1][i][j]`
- O pasa por $k$ → `dp[k-1][i][k] + dp[k-1][k][j]`

Como `dist[i][k]` y `dist[k][j]` ya tienen sus valores definitivos cuando procesamos $k$ (porque estamos mirando si $k$ es intermedio, no fuente/destino), podemos hacer la DP **in-place** en una sola matriz 2D.

---

## 2. Por Qué el Loop de k DEBE Ser el Más Externo

```
CORRECTO:
for k in range(N):    ← k más externo: cuando procesamos k como intermedio,
  for i in range(N):     dist[i][k] y dist[k][j] ya tienen los mejores valores
    for j in range(N):   considerando intermedios {0,...,k-1}
      dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])

INCORRECTO (si i fuera el más externo):
for i in range(N):
  for k in range(N):
    for j in range(N):
      dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
  ← Al calcular dist[i][j], dist[i][k] puede haber sido
    actualizado en la misma iteración de i, usando intermedios
    que aún no deberían estar disponibles.
```

**Contraejemplo de por qué falla con k no externo:**

```
Grafo: 0→1 (peso 1), 1→2 (peso 1), 0→2 (peso 5)
Dist correcta: dist[0][2] = 2 (pasando por 1)

Con i externo, k segundo (i=0, k=1, j=2):
  Al procesar k=1: dist[0][2] = min(5, dist[0][1] + dist[1][2]) = min(5, 1+1) = 2 ✓

Pero si hubiera un camino 0→1→2→3 y el nodo 3 fuera necesario para actualizar algo,
el orden incorrecto podría usar actualizaciones de la iteración actual de i=0
para calcular dist[0][j] con intermedios en el orden equivocado.
En el ejemplo simple funciona, pero en general NO es correcto.
```

---

## 3. Implementación Completa — Comentada

```cpp
// Floyd-Warshall — O(N³) tiempo, O(N²) espacio
// CPH Cap. 13 | CP4 §4.5
// Calcula distancias mínimas entre todos los pares
// SOPORTA pesos negativos (pero no ciclos negativos — los detecta)

#include <bits/stdc++.h>
using namespace std;

const long long LINF = 1e18;

// dist[i][j] = distancia mínima de i a j
// INICIALIZAR ANTES de llamar:
//   dist[i][i] = 0 para todo i
//   dist[i][j] = peso(i,j) si hay arista
//   dist[i][j] = LINF si no hay arista

void floyd_warshall(int N, vector<vector<long long>>& dist) {
    // k: nodo intermedio que estamos "habilitando"
    // CRÍTICO: k debe ser el loop más externo
    for (int k = 0; k < N; k++) {
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < N; j++) {
                // Solo relajar si el camino i→k→j es finito
                if (dist[i][k] == LINF || dist[k][j] == LINF) continue;
                
                // ¿Es más corto ir de i a j pasando por k?
                dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
            }
        }
    }
    // Después: dist[i][j] = distancia mínima entre todo par (i,j)
    // dist[i][i] < 0 → ciclo negativo contiene i
}
```

### Inicialización Completa

```cpp
// Lectura y preparación para Floyd-Warshall
int N, M;
cin >> N >> M;

vector<vector<long long>> dist(N, vector<long long>(N, LINF));

// dist[i][i] = 0 (distancia de un nodo a sí mismo)
for (int i = 0; i < N; i++) dist[i][i] = 0;

// Leer aristas
for (int i = 0; i < M; i++) {
    int u, v;
    long long w;
    cin >> u >> v >> w;
    u--; v--;  // a 0-based
    
    // IMPORTANTE: si hay múltiples aristas entre (u,v), tomar la mínima
    dist[u][v] = min(dist[u][v], w);
    
    // Si no dirigido:
    dist[v][u] = min(dist[v][u], w);
}

// Ejecutar Floyd-Warshall
floyd_warshall(N, dist);
```

---

## 4. Detección de Ciclos Negativos

```cpp
// Después de ejecutar Floyd-Warshall:
// Si dist[i][i] < 0 → el nodo i está en un ciclo negativo

bool has_negative_cycle(int N, vector<vector<long long>>& dist) {
    for (int i = 0; i < N; i++) {
        if (dist[i][i] < 0) return true;
    }
    return false;
}

// Para saber si el camino de u a v pasa por un ciclo negativo:
// (dist[u][v] puede ser incorrecto si hay ciclo negativo en el camino)
bool path_affected_by_neg_cycle(int u, int v, int N, vector<vector<long long>>& dist) {
    for (int k = 0; k < N; k++) {
        if (dist[k][k] < 0 && dist[u][k] != LINF && dist[k][v] != LINF)
            return true;  // el camino u→v puede mejorar indefinidamente
    }
    return false;
}
```

---

## 5. Reconstrucción del Camino

```cpp
// Floyd-Warshall con reconstrucción de camino
// next[i][j] = siguiente nodo en el camino mínimo de i a j

vector<vector<int>> next_node;  // next[i][j]

void floyd_warshall_with_path(int N, vector<vector<long long>>& dist) {
    // Inicializar next
    next_node.assign(N, vector<int>(N, -1));
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++)
            if (dist[i][j] != LINF && i != j)
                next_node[i][j] = j;  // el siguiente en camino directo es j
    
    for (int k = 0; k < N; k++) {
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < N; j++) {
                if (dist[i][k] == LINF || dist[k][j] == LINF) continue;
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    next_node[i][j] = next_node[i][k];  // pasar por k primero
                }
            }
        }
    }
}

// Reconstruir el camino de u a v
vector<int> get_path(int u, int v) {
    if (next_node[u][v] == -1) return {};  // inalcanzable
    vector<int> path;
    path.push_back(u);
    while (u != v) {
        u = next_node[u][v];
        path.push_back(u);
    }
    return path;
}
```

---

## 6. Clausura Transitiva (Transitive Closure)

Floyd-Warshall puede verificar si existe algún camino (no mínimo) entre todo par.

```cpp
// Clausura transitiva: reach[i][j] = ¿existe camino de i a j?
void transitive_closure(int N, vector<vector<bool>>& reach) {
    // Inicializar: reach[i][j] = true si hay arista (i,j) o i==j
    
    for (int k = 0; k < N; k++)
        for (int i = 0; i < N; i++)
            for (int j = 0; j < N; j++)
                reach[i][j] = reach[i][j] || (reach[i][k] && reach[k][j]);
}
```

---

## 7. Cuándo Usar Floyd-Warshall

**Usar FW cuando:**
- Necesitas distancias entre **todos los pares**
- $N \leq 500$ (para que $N^3$ sea manejable: $500^3 = 1.25 \times 10^8$)
- El grafo puede tener **pesos negativos** (sin ciclos negativos)
- Necesitas **clausura transitiva**

**No usar FW cuando:**
- $N > 500$ → demasiado lento
- Solo necesitas distancias desde **una fuente** → Dijkstra o BF
- El grafo es muy disperso → Dijkstra repetido es más rápido

### Dijkstra Repetido vs Floyd-Warshall

| Situación | Mejor opción |
|-----------|-------------|
| $N \leq 500$, grafo denso | Floyd-Warshall |
| $N \leq 500$, todos pesos ≥ 0 | Dijkstra × $N$ ($O(N \cdot M \log N)$) si $M \ll N^2$ |
| $N \leq 500$, pesos negativos | Floyd-Warshall |
| $N \leq 1000$, sparse, todos ≥ 0 | Dijkstra × $N$ |
| Solo una fuente | Dijkstra / Bellman-Ford |

---

## 8. Distancia Máxima en el Grafo

```cpp
// Diámetro del grafo = max(dist[i][j]) para todo i,j alcanzables
long long diameter = 0;
for (int i = 0; i < N; i++)
    for (int j = 0; j < N; j++)
        if (dist[i][j] != LINF)
            diameter = max(diameter, dist[i][j]);
```

---

## 9. Trampas Comunes

### Trampa 1: k No es el Loop Más Externo

```cpp
// MAL: i más externo → resultado incorrecto
for (int i = 0; i < N; i++)
    for (int k = 0; k < N; k++)
        for (int j = 0; j < N; j++)
            dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);

// BIEN: k más externo
for (int k = 0; k < N; k++)
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++)
            dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
```

### Trampa 2: Overflow en LINF + LINF

```cpp
// MAL: si LINF = 1e9 y usamos int
dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
// Si dist[i][k] = LINF = 1e9 y dist[k][j] = 1: LINF+1 overflows int (max int ≈ 2.1e9)!

// BIEN: verificar antes de sumar
if (dist[i][k] != LINF && dist[k][j] != LINF)
    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);

// O usar long long con LINF = 1e18 y no habrá overflow
```

### Trampa 3: No Inicializar dist[i][i] = 0

```cpp
// MAL: no poner dist[i][i] = 0
// Resultado: FW puede calcular distancias incorrectas

// BIEN:
for (int i = 0; i < N; i++) dist[i][i] = 0;
```

### Trampa 4: Múltiples Aristas Entre el Mismo Par

```cpp
// MAL: sobrescribir en lugar de tomar mínimo
dist[u][v] = w;  // si ya había una arista más barata, se pierde

// BIEN:
dist[u][v] = min(dist[u][v], (long long)w);
```

---

## 10. Ejemplo Paso a Paso

```
Grafo (0-based, dirigido):
Nodos: {0, 1, 2, 3}
Aristas: 0→1 (w=3), 0→3 (w=5), 1→2 (w=2), 2→3 (w=1), 3→1 (w=1)

Inicialización de dist:
     0    1    2    3
0  [ 0    3   INF   5  ]
1  [INF   0    2   INF ]
2  [INF  INF   0    1  ]
3  [INF   1   INF   0  ]

k=0: ¿Pasar por 0?
  dist[1][j] = min(dist[1][j], dist[1][0]+dist[0][j]) → dist[1][0]=INF → sin cambio
  dist[2][j] = min(dist[2][j], dist[2][0]+dist[0][j]) → dist[2][0]=INF → sin cambio
  dist[3][j] = min(dist[3][j], dist[3][0]+dist[0][j]) → dist[3][0]=INF → sin cambio
  Sin cambios después de k=0.

k=1: ¿Pasar por 1?
  dist[0][2] = min(INF, dist[0][1]+dist[1][2]) = min(INF, 3+2) = 5
  dist[0][3] = min(5, dist[0][1]+dist[1][3]) = min(5, 3+INF) = 5
  dist[3][2] = min(INF, dist[3][1]+dist[1][2]) = min(INF, 1+2) = 3
  dist[3][3] = min(0, dist[3][1]+dist[1][3]) = min(0, 1+INF) = 0

     0    1    2    3
0  [ 0    3    5    5  ]
1  [INF   0    2   INF ]
2  [INF  INF   0    1  ]
3  [INF   1    3    0  ]

k=2: ¿Pasar por 2?
  dist[0][3] = min(5, dist[0][2]+dist[2][3]) = min(5, 5+1) = 5 (sin cambio)
  dist[1][3] = min(INF, dist[1][2]+dist[2][3]) = min(INF, 2+1) = 3
  dist[3][3] = min(0, dist[3][2]+dist[2][3]) = min(0, 3+1) = 0

     0    1    2    3
0  [ 0    3    5    5  ]
1  [INF   0    2    3  ]
2  [INF  INF   0    1  ]
3  [INF   1    3    0  ]

k=3: ¿Pasar por 3?
  dist[0][1] = min(3, dist[0][3]+dist[3][1]) = min(3, 5+1) = 3 (sin cambio)
  dist[1][1] = min(0, dist[1][3]+dist[3][1]) = min(0, 3+1) = 0
  dist[2][1] = min(INF, dist[2][3]+dist[3][1]) = min(INF, 1+1) = 2
  dist[2][2] = min(0, dist[2][3]+dist[3][2]) = min(0, 1+3) = 0
  ...

RESULTADO FINAL:
     0    1    2    3
0  [ 0    3    5    5  ]
1  [INF   0    2    3  ]
2  [INF   2    0    1  ]
3  [INF   1    3    0  ]

Verificar: dist[2][1] = 2 → camino 2→3→1 (1+1=2) ✓
```

---

## 11. Checklist Pre-Submit

```
[ ] ¿k es el loop más externo?
[ ] ¿Inicialicé dist[i][i] = 0?
[ ] ¿Inicialicé dist[i][j] = LINF para i≠j (sin arista)?
[ ] ¿Para múltiples aristas entre (u,v), tomé el mínimo?
[ ] ¿Verifico dist[i][k] != LINF && dist[k][j] != LINF antes de sumar?
[ ] ¿Uso long long para evitar overflow?
[ ] ¿N ≤ 500 para que N³ sea manejable?
[ ] ¿Manejo ciclos negativos? (dist[i][i] < 0)
[ ] ¿La indexación es 0-based?
```

---

## 🔗 Relacionado

- [[04_DIJKSTRA]]
- [[05_BELLMAN_FORD]]
- [[icpc/temas/GRAPHS_ICPC/01_RECETA_UNIVERSAL]]
- [[17_ERRORES_CONCEPTUALES]]

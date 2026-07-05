---
titulo: "Dijkstra — Camino Más Corto con Pesos No Negativos"
tipo: icpc-tema
categoria: grafos
estado: en-progreso
etiquetas: [icpc, icpc/tema, icpc/categoria/grafos]
fuente-cph: "Cap. 13"
fuente-cp4: "§4.4.3"
creado: 2026-04-17
actualizado: 2026-04-17
---

# Dijkstra — Camino Más Corto con Pesos No Negativos

> CPH Cap. 13 | CP4 §4.4.3 | CPA: dijkstra

Dijkstra es el algoritmo estándar para encontrar el camino más corto desde una fuente a todos los demás nodos, cuando todos los pesos son **no negativos**. Es la extensión natural de BFS para grafos ponderados.

---

## 1. Intuición Profunda

### BFS con Pesos

BFS funciona para grafos no ponderados porque todos los pasos tienen el mismo costo (1). La idea de Dijkstra es generalizar esto para pesos arbitrarios no negativos.

**La estrategia voraz:** En cada paso, procesar el nodo con la **distancia mínima conocida** que aún no ha sido "finalizado". Este nodo no puede mejorar más porque todos los demás caminos serían más largos (los pesos son ≥ 0).

```
BFS usa:   queue (FIFO) — todos los pasos cuestan 1
Dijkstra:  priority_queue (min-heap) — los pasos cuestan w[u][v]
```

### Diagrama de Ejecución

```
Grafo con pesos:
       2       4
   0 ──── 1 ──── 3
   │      │
   │5     │1
   │      │
   2 ──── 4
       3

Dijkstra desde 0:

Init: dist=[0, ∞, ∞, ∞, ∞], heap=[(0,0)]

PASO 1: Extraer (0,0) — procesar nodo 0
  Relajar 0→1: dist[1] = min(∞, 0+2) = 2, heap=[(2,1)]
  Relajar 0→2: dist[2] = min(∞, 0+5) = 5, heap=[(2,1),(5,2)]
  dist=[0, 2, 5, ∞, ∞]

PASO 2: Extraer (2,1) — procesar nodo 1
  Relajar 1→3: dist[3] = min(∞, 2+4) = 6, heap=[(5,2),(6,3)]
  Relajar 1→4: dist[4] = min(∞, 2+1) = 3, heap=[(3,4),(5,2),(6,3)]
  dist=[0, 2, 5, 6, 3]

PASO 3: Extraer (3,4) — procesar nodo 4
  Relajar 4→2: dist[2] = min(5, 3+3) = 5 (no mejora)
  dist=[0, 2, 5, 6, 3]

PASO 4: Extraer (5,2) — procesar nodo 2
  Sin vecinos nuevos que mejoren
  dist=[0, 2, 5, 6, 3]

PASO 5: Extraer (6,3) — procesar nodo 3
  Sin vecinos
  dist=[0, 2, 5, 6, 3]   ← RESULTADO FINAL
```

---

## 2. Implementación con `priority_queue` — Comentada

```cpp
// Dijkstra con min-heap — O((N+M) log N)
// CPH Cap. 13 | CP4 §4.4.3
// PREREQUISITO: todos los pesos w >= 0
// Retorna: dist[v] = distancia mínima de src a v (LINF si inalcanzable)

#include <bits/stdc++.h>
using namespace std;

const long long LINF = 1e18;  // usar long long para evitar overflow

// adj[u] = {(v, w)} — lista de adyacencia ponderada
vector<long long> dijkstra(int src, int N, vector<vector<pair<int,int>>>& adj) {
    
    // Inicializar todas las distancias como infinito
    vector<long long> dist(N, LINF);
    
    // Min-heap: pair<distancia, nodo>
    // greater<> hace que el par con menor distancia quede en el top
    priority_queue<pair<long long,int>,
                   vector<pair<long long,int>>,
                   greater<pair<long long,int>>> pq;
    
    // La fuente está a distancia 0 de sí misma
    dist[src] = 0;
    pq.push({0LL, src});
    
    while (!pq.empty()) {
        // Extraer el nodo con menor distancia conocida
        auto [d, u] = pq.top();
        pq.pop();
        
        // =============================================
        // OPTIMIZACIÓN CLAVE: "lazy deletion"
        // Si la distancia en el heap es mayor que dist[u],
        // este par es OBSOLETO (ya encontramos un mejor camino a u).
        // Ignorarlo y continuar.
        // =============================================
        if (d > dist[u]) continue;
        
        // Procesar todas las aristas que salen de u
        for (auto [v, w] : adj[u]) {
            // Intentar relajar la arista u→v
            // ¿Es más corto llegar a v pasando por u?
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;    // actualizar distancia
                pq.push({dist[v], v});    // encolar el nuevo par (puede crear duplicado)
                // NO eliminamos el par antiguo del heap (lazy deletion)
            }
        }
    }
    
    return dist;
    // dist[v] == LINF significa que v es inalcanzable desde src
}
```

---

## 3. Por Qué `if (d > dist[u]) continue`

Esta línea es crucial. Explicación detallada:

```
Situación: Hemos encontrado dist[u] = 5 y encolado (5, u).
Luego encontramos un camino mejor: dist[u] = 3 y encolamos (3, u).

El heap contiene AMBOS pares: (3, u) y (5, u).
Cuando sacamos (3, u): d=3, dist[u]=3, d == dist[u] → procesamos normalmente.
Cuando sacamos (5, u): d=5, dist[u]=3, d > dist[u] → OBSOLETO → ignorar.

Sin este check: procesaríamos u DOS VECES, potencialmente con distancias incorrectas.
Con este check: procesamos u exactamente UNA VEZ (cuando se extrae con la distancia correcta).
```

**¿Por qué no eliminamos el par antiguo del heap?**
C++ `priority_queue` no soporta "decrease key" eficientemente. La alternativa lazy deletion es O(M log M) en lugar de O(M log N), pero en la práctica son iguales porque M ≤ N².

---

## 4. Complejidad Desglosada

**Con `priority_queue` (lazy deletion):**

- Cada arista $(u, v)$ puede causar a lo sumo un `push` al heap: $O(M)$ operaciones de push.
- Cada push es $O(\log M) = O(\log N^2) = O(\log N)$.
- Total push: $O(M \log N)$.
- Extracciones del heap: hay a lo sumo $O(M)$ pares en el heap, cada extracción $O(\log M) = O(\log N)$.
- Total: $\mathbf{O((N+M) \log N)}$.

**Comparación de implementaciones:**

| Implementación | Tiempo | Recomendado cuando |
|----------------|--------|-------------------|
| priority_queue (lazy) | $O((N+M) \log N)$ | Siempre en ICPC |
| priority_queue (decrease key) | $O((N+M) \log N)$ | Teóricamente igual |
| Fibonacci heap | $O(M + N \log N)$ | Solo teórico, difícil implementar |
| Sin heap (naive) | $O(N^2)$ | Grafos densos con N≤1000 |

---

## 5. Dijkstra Naive — Para Grafos Densos

```cpp
// Dijkstra O(N²) — útil cuando M ≈ N² y N ≤ 1000
// CPH Cap. 13 (variante) | CP4 §4.4.3

vector<long long> dijkstra_naive(int src, int N, vector<vector<pair<int,int>>>& adj) {
    const long long LINF = 1e18;
    vector<long long> dist(N, LINF);
    vector<bool> finalized(N, false);  // ¿ya encontramos la distancia mínima?
    
    dist[src] = 0;
    
    for (int iter = 0; iter < N; iter++) {
        // Encontrar el nodo no finalizado con menor distancia — O(N)
        int u = -1;
        for (int v = 0; v < N; v++) {
            if (!finalized[v] && (u == -1 || dist[v] < dist[u]))
                u = v;
        }
        
        if (dist[u] == LINF) break;  // componentes desconectadas
        finalized[u] = true;
        
        // Relajar vecinos de u — O(grado(u))
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    
    return dist;
}
```

---

## 6. Variante: Reconstrucción del Camino Mínimo

```cpp
// Dijkstra con reconstrucción de camino
// Retorna {distancia, camino} desde src hasta dst

pair<long long, vector<int>> dijkstra_path(int src, int dst, int N,
                                            vector<vector<pair<int,int>>>& adj) {
    const long long LINF = 1e18;
    vector<long long> dist(N, LINF);
    vector<int> prev(N, -1);  // prev[v] = nodo anterior en el camino mínimo a v
    priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
    
    dist[src] = 0;
    pq.push({0, src});
    
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                prev[v] = u;         // registrar de dónde venimos
                pq.push({dist[v], v});
            }
        }
    }
    
    if (dist[dst] == LINF) return {-1, {}};  // inalcanzable
    
    // Reconstruir camino desde dst hacia atrás usando prev[]
    vector<int> path;
    for (int v = dst; v != -1; v = prev[v])
        path.push_back(v);
    reverse(path.begin(), path.end());  // invertir para src→dst
    
    return {dist[dst], path};
}
```

---

## 7. Variante: Multi-Source Dijkstra

Cuando hay múltiples fuentes, todas con distancia 0.

```cpp
// Multi-Source Dijkstra
// Útil: distancia mínima desde cualquier fuente del conjunto S

vector<long long> dijkstra_multi(vector<int>& sources, int N,
                                  vector<vector<pair<int,int>>>& adj) {
    const long long LINF = 1e18;
    vector<long long> dist(N, LINF);
    priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
    
    // Encolar TODAS las fuentes con distancia 0
    for (int s : sources) {
        dist[s] = 0;
        pq.push({0LL, s});
    }
    
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    
    return dist;
}
```

---

## 8. Variante: Dijkstra en Grafo con Estado Expandido

Para problemas donde el estado no es solo el nodo actual.

```cpp
// Dijkstra con estado (nodo, aristas_usadas)
// Ejemplo: encontrar camino mínimo usando exactamente K aristas

const int MAXN = 1005;
const int MAXK = 1005;
const long long LINF = 1e18;

vector<long long> dist_k[MAXN];  // dist_k[v][k] = min dist a v usando exactamente k aristas

void dijkstra_k_edges(int src, int N, int K, vector<vector<pair<int,int>>>& adj) {
    for (int i = 0; i < N; i++) dist_k[i].assign(K+1, LINF);
    
    // Estado: {distancia, nodo, aristas_usadas}
    priority_queue<tuple<long long,int,int>, vector<tuple<long long,int,int>>, greater<>> pq;
    
    dist_k[src][0] = 0;
    pq.push({0, src, 0});
    
    while (!pq.empty()) {
        auto [d, u, k] = pq.top(); pq.pop();
        if (d > dist_k[u][k]) continue;
        if (k == K) continue;  // ya usamos K aristas, no expandir más
        
        for (auto [v, w] : adj[u]) {
            if (d + w < dist_k[v][k+1]) {
                dist_k[v][k+1] = d + w;
                pq.push({dist_k[v][k+1], v, k+1});
            }
        }
    }
}
```

---

## 9. Por Qué Dijkstra Falla con Pesos Negativos

```
Contraejemplo:
    0 --2--> 1 --(-5)--> 2
    
Dijkstra encuentra: dist[0]=0, dist[1]=2, dist[2]=2+(-5)=-3

Pero supón: 0 --10--> 2
Dijkstra podría finalizar dist[2]=10 ANTES de descubrir el camino 0→1→2=-3
porque dist[1]=2 se procesa después de haber "finalizado" dist[2]=10... 

Espera, en este caso sí funciona porque dist[1] < dist[2] en el heap.

Un contraejemplo real que falla:
    0 --1--> 1
    0 --4--> 2
    1 --(-3)--> 2

Dijkstra:
  Extrae (0,0): relaja 1→dist[1]=1, 2→dist[2]=4
  Extrae (1,1): relaja 1→2 con -3: dist[2] = 1+(-3) = -2, encola (-2,2)
  Extrae (-2,2): OK, dist[2]=-2 — correcto en este caso

El fallo real ocurre en ciclos negativos:
    0 --1--> 1 --(-2)--> 0 (ciclo negativo: 0→1→0 cuesta -1)
    
Dijkstra no detecta el ciclo y puede dar respuestas incorrectas o loop infinito.
```

**Regla:** Si hay cualquier posibilidad de pesos negativos → usar Bellman-Ford.

---

## 10. Tabla Comparativa: BFS vs Dijkstra vs Bellman-Ford

| Aspecto | BFS | Dijkstra | Bellman-Ford |
|---------|-----|---------|--------------|
| Pesos | No ponderado (todos =1) | ≥ 0 | Cualquiera |
| Complejidad | $O(N+M)$ | $O(M \log N)$ | $O(N \cdot M)$ |
| Detecta ciclos negativos | No | No | Sí |
| Implementación | Simple | Moderada | Simple |
| N máximo típico | $10^6$ | $10^5$ | $10^3$ |
| Estructura | `queue` | `priority_queue` | Lista de aristas |

---

## 11. Ejemplo Completo con Código

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int N, M, src;
    cin >> N >> M >> src;
    src--;  // a 0-based
    
    vector<vector<pair<int,int>>> adj(N);
    for (int i = 0; i < M; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        u--; v--;
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});  // no dirigido — quitar si dirigido
    }
    
    const long long LINF = 1e18;
    vector<long long> dist(N, LINF);
    priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
    dist[src] = 0;
    pq.push({0, src});
    
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    
    for (int i = 0; i < N; i++) {
        if (dist[i] == LINF) cout << -1;  // inalcanzable
        else cout << dist[i];
        cout << "\n";
    }
    
    return 0;
}
```

---

## 12. Trampas Comunes y Fixes

### Trampa 1: Usar `int` cuando los pesos pueden producir overflow

```cpp
// MAL: pesos son hasta 10^9 y hay N=10^5 nodos
// dist podría ser hasta 10^9 * 10^5 = 10^14 → overflow int
vector<int> dist(N, 1e9);   // WRONG

// BIEN:
const long long LINF = 1e18;
vector<long long> dist(N, LINF);
```

### Trampa 2: INF muy pequeño (suma de dos INF = negativo)

```cpp
// MAL:
const int INF = 2e9;  // si dist[u] = INF y w = 1: INF+1 overflows!
if (dist[u] + w < dist[v])  // dist[u] puede ser INF

// BIEN: verificar antes de sumar
if (dist[u] != LINF && dist[u] + w < dist[v])
// O simplemente usar long long y LINF = 1e18 — no hay overflow posible en ICPC
```

### Trampa 3: Olvidar el `if (d > dist[u]) continue`

```cpp
// MAL: sin lazy deletion
while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    // Procesamos u múltiples veces → TLE en grafos con muchas actualizaciones
    for (auto [v, w] : adj[u]) { ... }
}

// BIEN: con lazy deletion
if (d > dist[u]) continue;
```

### Trampa 4: Usar con pesos negativos

```
Síntoma: WA (respuestas incorrectas), o loop infinito si hay ciclo negativo.
Fix: Si hay pesos negativos → Bellman-Ford.
```

### Trampa 5: Grafo dirigido pero tratar como no dirigido

```cpp
// MAL: olvidar eliminar la línea bidireccional
adj[u].push_back({v, w});
adj[v].push_back({u, w});  // ← borrar si el grafo es dirigido

// Síntoma: distancias menores de las correctas (toma caminos de regreso)
```

---

## 13. Checklist Pre-Submit para Dijkstra

```
[ ] ¿Uso long long para dist? (no int)
[ ] ¿LINF = 1e18 (no 1e9)?
[ ] ¿Tengo if (d > dist[u]) continue en el loop principal?
[ ] ¿El grafo es dirigido o no dirigido? ¿Aristas en ambas/una dirección?
[ ] ¿Todos los pesos son >= 0? (si no → Bellman-Ford)
[ ] ¿Manejo nodos inalcanzables? (dist[v] == LINF → -1 o "impossible")
[ ] ¿El par en el heap es {distancia, nodo} (no {nodo, distancia})?
[ ] ¿Uso greater<> para min-heap?
[ ] Si reconstruyo camino: ¿inv iero el vector al final?
[ ] ¿La indexación es correcta? (0-based en código, 1-based en input → restar 1)
```

---

## 🔗 Relacionado

- [[02_BFS]]
- [[05_BELLMAN_FORD]]
- [[06_FLOYD_WARSHALL]]
- [[icpc/temas/GRAPHS_ICPC/01_RECETA_UNIVERSAL]]
- [[17_ERRORES_CONCEPTUALES]]
- [[18_CASOS_EDGE]]

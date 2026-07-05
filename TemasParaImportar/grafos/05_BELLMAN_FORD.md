---
titulo: "Bellman-Ford — Camino Más Corto con Pesos Negativos"
tipo: icpc-tema
categoria: grafos
estado: en-progreso
etiquetas: [icpc, icpc/tema, icpc/categoria/grafos]
fuente-cph: "Cap. 13"
fuente-cp4: "§4.4.4"
creado: 2026-04-17
actualizado: 2026-04-17
---

# Bellman-Ford — Camino Más Corto con Pesos Negativos

> CPH Cap. 13 | CP4 §4.4.4 | CPA: bellman-ford

Bellman-Ford resuelve el problema de camino más corto desde una fuente cuando el grafo puede tener **pesos negativos**. También detecta **ciclos negativos** (ciclos cuya suma de pesos es negativa), que Dijkstra no puede manejar.

---

## 1. Intuición

### La Analogía de la Propagación

Imagina que la información de distancias se propaga lentamente, arista por arista. En la iteración $k$, dist[v] contiene la distancia mínima usando a lo sumo $k$ aristas.

- Después de 0 iteraciones: solo dist[src] = 0 es correcto.
- Después de 1 iteración: los vecinos directos de src tienen distancias correctas.
- Después de $k$ iteraciones: nodos alcanzables con a lo sumo $k$ aristas tienen distancias correctas.
- Después de $N-1$ iteraciones: **todos** los nodos tienen distancias correctas.

**¿Por qué $N-1$?** El camino más corto sin ciclos (en un grafo con $N$ nodos) usa a lo sumo $N-1$ aristas.

---

### Por Qué Dijkstra Falla con Pesos Negativos

```
Contraejemplo clásico:
    0 ──3──> 1 ──(-4)──> 2
    └────────────────────2──────────────>2

Dijkstra: procesa 0 (dist=0), luego extrae (2,1) (dist[1]=3), FINALIZA 1.
          Luego extrae (2,2): dist[2]=2 → CORRECTO en este caso.

¿Cuándo falla exactamente?
    0 ──5──> 1
    0 ──2──> 2
    2 ──(-4)──> 1   ← peso negativo

Dijkstra:
  dist=[0,∞,∞], heap=[(0,0)]
  Extrae (0,0): dist[1]=5, dist[2]=2, heap=[(2,2),(5,1)]
  Extrae (2,2): dist[1] = min(5, 2+(-4)) = -2, heap=[(-2,1),(5,1)]
  Extrae (-2,1): dist[1]=-2, d=-2 == dist[1]=-2, PROCESA. OK.
  Extrae (5,1): d=5 > dist[1]=-2, skip.

En este caso funciona! El problema real es con ciclos negativos:
    0 ──1──> 1 ──(-3)──> 2 ──1──> 1   ← ciclo negativo 1→2→1

Dijkstra entraría en un loop infinito actualizando indefinidamente.
Bellman-Ford detecta esto en la N-ésima iteración.
```

---

## 2. Implementación Estándar — Comentada

```cpp
// Bellman-Ford — O(N * M)
// CPH Cap. 13 | CP4 §4.4.4
// SOPORTA pesos negativos. DETECTA ciclos negativos.

#include <bits/stdc++.h>
using namespace std;

const long long LINF = 1e18;

// edges = lista de aristas {u, v, w}
// Retorna dist[] con LINF para inalcanzables
// Si hay ciclo negativo alcanzable desde src → algunos valores son inestables

vector<long long> bellman_ford(int src, int N, vector<tuple<int,int,int>>& edges) {
    
    // Inicializar todas las distancias como infinito
    vector<long long> dist(N, LINF);
    dist[src] = 0;  // la fuente está a distancia 0
    
    // Realizar N-1 iteraciones de relajación
    for (int iter = 0; iter < N - 1; iter++) {
        bool updated = false;  // optimización: si no hubo cambio, terminar
        
        // Relaja TODAS las aristas del grafo
        for (auto [u, v, w] : edges) {
            // Solo relaja si u es alcanzable (dist[u] != LINF)
            if (dist[u] == LINF) continue;
            
            // ¿Podemos llegar a v más rápido pasando por u?
            if (dist[u] + (long long)w < dist[v]) {
                dist[v] = dist[u] + (long long)w;
                updated = true;
            }
        }
        
        // Si en una iteración no hubo ninguna actualización,
        // el algoritmo ya convergió → podemos terminar antes
        if (!updated) break;
    }
    
    return dist;
}

// Detección de ciclo negativo alcanzable desde src
// PRECONDICIÓN: llamar bellman_ford primero para obtener dist[]
bool has_negative_cycle(int N, vector<long long>& dist, vector<tuple<int,int,int>>& edges) {
    // Si en la N-ésima iteración AÚN hay relajación → hay ciclo negativo
    for (auto [u, v, w] : edges) {
        if (dist[u] == LINF) continue;
        // Si podemos seguir mejorando → ciclo negativo
        if (dist[u] + (long long)w < dist[v]) {
            return true;
        }
    }
    return false;
}
```

### Versión Unificada

```cpp
// Bellman-Ford completo con detección de ciclo negativo
// Retorna {dist[], tiene_ciclo_negativo}

pair<vector<long long>, bool> bellman_ford_full(int src, int N,
                                                  vector<tuple<int,int,int>>& edges) {
    const long long LINF = 1e18;
    vector<long long> dist(N, LINF);
    dist[src] = 0;
    
    bool negative_cycle = false;
    
    for (int iter = 0; iter < N; iter++) {  // N iteraciones (no N-1)
        bool updated = false;
        for (auto [u, v, w] : edges) {
            if (dist[u] == LINF) continue;
            if (dist[u] + (long long)w < dist[v]) {
                dist[v] = dist[u] + (long long)w;
                updated = true;
                if (iter == N - 1) {
                    // La N-ésima iteración produce cambio → ciclo negativo
                    negative_cycle = true;
                }
            }
        }
        if (!updated) break;
    }
    
    return {dist, negative_cycle};
}
```

---

## 3. Por Qué Funciona — Demostración Informal

**Invariante:** Después de la iteración $k$, `dist[v]` contiene la longitud del camino más corto de `src` a `v` usando **a lo sumo $k$ aristas**.

**Base (k=0):** `dist[src] = 0`, `dist[v] = LINF` para $v \neq \text{src}$. Correcto: el único camino con 0 aristas es el nodo a sí mismo.

**Paso inductivo:** Supón que después de $k$ iteraciones, `dist[v]` es correcto para caminos de a lo sumo $k$ aristas. En la iteración $k+1$, para cada arista $(u, v, w)$:
- `dist[u]` tiene el mínimo con a lo sumo $k$ aristas.
- `dist[u] + w` es la longitud del camino más corto a $v$ que pasa por $u$ como penúltimo nodo, usando a lo sumo $k+1$ aristas.
- El mínimo sobre todas las aristas $(u, v)$ da el camino de a lo sumo $k+1$ aristas.

**Conclusión:** Después de $N-1$ iteraciones, los caminos mínimos sin ciclos (a lo sumo $N-1$ aristas) están calculados correctamente. $\square$

---

## 4. Detección de Ciclos Negativos — Explicación Detallada

```
Si después de N-1 iteraciones AÚN podemos relajar alguna arista,
significa que existe un camino con N aristas que es MÁS CORTO que
el mejor camino con N-1 aristas.

Esto es imposible en un grafo sin ciclos negativos (el mejor camino
sin repetir nodos tiene a lo sumo N-1 aristas).

→ Si la N-ésima iteración produce cambio → existe un ciclo negativo.

Nota importante: el ciclo negativo debe ser ALCANZABLE desde src.
Bellman-Ford solo detecta ciclos negativos alcanzables.
Para detectar TODOS los ciclos negativos: ejecutar BF desde un
"super-fuente" con aristas de peso 0 a todos los nodos.
```

```cpp
// Detectar TODOS los ciclos negativos en el grafo
// Agregar super-fuente N con aristas (N, v, 0) para todo v
bool any_negative_cycle(int N, vector<tuple<int,int,int>>& edges) {
    // Agregar aristas de super-fuente
    for (int v = 0; v < N; v++) edges.push_back({N, v, 0});
    
    auto [dist, has_neg] = bellman_ford_full(N, N+1, edges);
    
    // Limpiar las aristas agregadas
    for (int v = 0; v < N; v++) edges.pop_back();
    
    return has_neg;
}
```

---

## 5. SPFA — Shortest Path Faster Algorithm

SPFA es una variante de Bellman-Ford que usa una cola para procesar solo los nodos que fueron actualizados recientemente. En promedio es más rápido, pero en el peor caso sigue siendo $O(N \cdot M)$.

```cpp
// SPFA — Bellman-Ford con cola
// Promedio: O(M), Peor caso: O(N*M)
// ⚠️ PUEDE TLE en grafos adversariales (no lo uses ciegamente)
// CP4 §4.4.4

const long long LINF = 1e18;

vector<long long> spfa(int src, int N, vector<vector<pair<int,int>>>& adj) {
    vector<long long> dist(N, LINF);
    vector<bool> in_queue(N, false);  // ¿está el nodo en la cola?
    
    queue<int> q;
    dist[src] = 0;
    q.push(src);
    in_queue[src] = true;
    
    while (!q.empty()) {
        int u = q.front(); q.pop();
        in_queue[u] = false;  // ya salió de la cola
        
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                if (!in_queue[v]) {  // encolar solo si no está en la cola
                    q.push(v);
                    in_queue[v] = true;
                }
            }
        }
    }
    
    return dist;
}
```

### Detección de Ciclo Negativo con SPFA

```cpp
// Si un nodo entra a la cola N o más veces → ciclo negativo
vector<int> entry_count(N, 0);

// En el loop, agregar:
entry_count[v]++;
if (entry_count[v] >= N) {
    // ciclo negativo detectado
    return {};
}
```

### SPFA vs Dijkstra vs Bellman-Ford

| Aspecto | SPFA | Dijkstra | Bellman-Ford |
|---------|------|---------|--------------|
| Pesos negativos | Sí | No | Sí |
| Ciclos negativos | Sí (detecta) | No | Sí |
| Tiempo promedio | $O(M)$ | $O(M \log N)$ | $O(N \cdot M)$ |
| Tiempo peor caso | $O(N \cdot M)$ | $O(M \log N)$ | $O(N \cdot M)$ |
| Seguro en concursos | ⚠️ Riesgo TLE | ✓ | ✓ si N·M ≤ 10^7 |

**Regla:** En concursos competitivos, prefiere Dijkstra cuando no hay pesos negativos. SPFA puede recibir casos adversariales diseñados específicamente para hacerlo TLE.

---

## 6. Aplicaciones

### Detección de Arbitrage

En problemas de cambio de divisas: convertir moneda A a B a C y obtener más de lo inicial.

```
Modelar: nodo = divisa, arista (A→B) con peso -log(tasa_cambio)
Si hay ciclo negativo → hay oportunidad de arbitrage
```

```cpp
// Transformar tasas de cambio para usar Bellman-Ford
// Si se puede cambiar A a B con tasa r[A][B]:
// peso de la arista A→B = -log(r[A][B])
// Ciclo negativo = ciclo donde producto de tasas > 1 = arbitrage
for (int u = 0; u < N; u++)
    for (int v = 0; v < N; v++)
        if (rate[u][v] > 0)
            edges.push_back({u, v, (int)(-log(rate[u][v]) * 1e9)});
```

### Problemas con Penalizaciones

Cuando el costo de un camino puede reducirse por ciertas condiciones (equivalente a pesos negativos).

---

## 7. Trampas Comunes

### Trampa 1: Relajar Aristas de Nodos Inalcanzables

```cpp
// MAL: sin verificar si dist[u] != LINF
for (auto [u, v, w] : edges) {
    if (dist[u] + w < dist[v])  // dist[u] = LINF → LINF + w puede overflow!
        dist[v] = dist[u] + w;

// BIEN:
for (auto [u, v, w] : edges) {
    if (dist[u] != LINF && dist[u] + w < dist[v])
        dist[v] = dist[u] + w;
```

### Trampa 2: Olvidar que SPFA Puede TLE

```
Síntoma: TLE en casos específicos diseñados para atacar SPFA.
Fix: Si el enunciado no garantiza pesos positivos pero tampoco negativos,
     y N,M son grandes → verificar si Dijkstra es posible (pesos no negativos).
     Si hay pesos negativos y N*M ≤ 10^7 → Bellman-Ford estándar es más seguro.
```

### Trampa 3: Dirección de las Aristas en Grafo Dirigido

```cpp
// Para grafo DIRIGIDO: solo una dirección
edges.push_back({u, v, w});
// NO agregar {v, u, w} — eso sería convertir en no dirigido

// Para grafo NO DIRIGIDO: ambas direcciones
edges.push_back({u, v, w});
edges.push_back({v, u, w});
```

### Trampa 4: N-1 vs N Iteraciones

```cpp
// Para encontrar caminos mínimos: N-1 iteraciones
for (int iter = 0; iter < N-1; iter++) { ... }

// Para detectar ciclos negativos: hacer UNA iteración más (la N-ésima)
// Si en esa iteración hay cambio → ciclo negativo
for (auto [u, v, w] : edges) {
    if (dist[u] != LINF && dist[u] + w < dist[v])
        return true; // ciclo negativo
}
```

---

## 8. Template Completo de Uso

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int N, M, src;
    cin >> N >> M >> src;
    src--;
    
    vector<tuple<int,int,int>> edges;
    for (int i = 0; i < M; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        u--; v--;
        edges.push_back({u, v, w});
        // Si no dirigido: edges.push_back({v, u, w});
    }
    
    const long long LINF = 1e18;
    vector<long long> dist(N, LINF);
    dist[src] = 0;
    
    bool neg_cycle = false;
    
    for (int iter = 0; iter < N; iter++) {
        for (auto [u, v, w] : edges) {
            if (dist[u] == LINF) continue;
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                if (iter == N-1) neg_cycle = true;
            }
        }
    }
    
    if (neg_cycle) {
        cout << "NEGATIVE CYCLE\n";
    } else {
        for (int i = 0; i < N; i++) {
            if (dist[i] == LINF) cout << "INF\n";
            else cout << dist[i] << "\n";
        }
    }
    
    return 0;
}
```

---

## 9. Checklist Pre-Submit

```
[ ] ¿Verifico dist[u] != LINF antes de relajar? (evita overflow)
[ ] ¿Uso long long para dist?
[ ] ¿El número de iteraciones es N-1 (para caminos) o N (para detectar ciclo)?
[ ] ¿Manejo correctamente grafos dirigidos vs no dirigidos?
[ ] ¿Si detecto ciclo negativo, reporto correctamente?
[ ] ¿SPFA es seguro en este problema? (¿hay casos adversariales posibles?)
[ ] ¿El grafo puede tener ciclos negativos no alcanzables desde src? (son inocuos)
```

---

## 🔗 Relacionado

- [[04_DIJKSTRA]]
- [[06_FLOYD_WARSHALL]]
- [[icpc/temas/GRAPHS_ICPC/01_RECETA_UNIVERSAL]]
- [[17_ERRORES_CONCEPTUALES]]

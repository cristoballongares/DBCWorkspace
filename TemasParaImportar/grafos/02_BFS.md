---
titulo: "BFS — Búsqueda en Anchura"
tipo: icpc-tema
categoria: grafos
estado: en-progreso
etiquetas: [icpc, icpc/tema, icpc/categoria/grafos]
fuente-cph: "Cap. 11"
fuente-cp4: "§4.2"
creado: 2026-04-17
actualizado: 2026-04-17
---

# BFS — Búsqueda en Anchura

> CPH Cap. 11 | CP4 §4.2 | CPA: bfs

BFS (Breadth-First Search) es el algoritmo más fundamental para grafos no ponderados. Garantiza encontrar el camino más corto (en número de aristas) desde un nodo fuente a todos los demás.

---

## 1. Intuición Profunda

### La Analogía del Agua

Imagina que lanzas una piedra en un estanque. Las ondas se expanden en círculos concéntricos, alcanzando primero los puntos más cercanos y luego los más lejanos. BFS funciona exactamente así:

```
Nivel 0:     [S]
             / \
Nivel 1:  [A] [B]
          /|   |\
Nivel 2: [C][D][E][F]
```

- El nodo fuente $S$ está a distancia 0.
- Sus vecinos están a distancia 1.
- Los vecinos de los vecinos (no visitados) están a distancia 2.
- Y así sucesivamente.

### La Propiedad FIFO

BFS usa una **cola** (FIFO = First In, First Out). Esta propiedad es la clave:

**¿Por qué la primera visita garantiza distancia mínima?**

Supón que existe un camino más corto a $v$ que el que BFS encontró. Ese camino pasaría por algún nodo $u$ a distancia $d-1$. Pero BFS ya procesó todos los nodos a distancia $d-1$ antes de procesar los de distancia $d$. Contradicción: $u$ ya fue procesado y habría encolado $v$. ∴ La primera visita de BFS es la distancia mínima. $\square$

---

## 2. Diagrama de Ejecución ASCII

```
Grafo de ejemplo:
    0 --- 1 --- 3
    |     |
    2 --- 4

BFS desde nodo 0:

INICIAL:
  Cola: [0]
  dist: [0, -1, -1, -1, -1]

PASO 1: sacar 0, encolar vecinos {1, 2}
  Cola: [1, 2]
  dist: [0, 1, 1, -1, -1]

PASO 2: sacar 1, vecinos {0,3,4} → 0 ya visitado, encolar {3,4}
  Cola: [2, 3, 4]
  dist: [0, 1, 1, 2, 2]

PASO 3: sacar 2, vecinos {0,4} → ambos visitados
  Cola: [3, 4]
  dist: [0, 1, 1, 2, 2]

PASO 4: sacar 3, vecinos {1} → visitado
  Cola: [4]
  dist: [0, 1, 1, 2, 2]

PASO 5: sacar 4, vecinos {1,2} → ambos visitados
  Cola: []
  dist: [0, 1, 1, 2, 2]   ← RESULTADO FINAL
```

---

## 3. Implementación Estándar — Comentada Línea por Línea

```cpp
// BFS estándar — distancia mínima sin pesos
// CPH Cap. 11 | CP4 §4.2
// Complejidad: O(N + M) tiempo, O(N) espacio para dist
// Prerequisito: grafo dado como lista de adyacencia adj[u] = {v1, v2, ...}

#include <bits/stdc++.h>
using namespace std;

// Retorna vector dist donde dist[v] = distancia mínima de start a v
// dist[v] = -1 si v no es alcanzable desde start
vector<int> bfs(int start, int N, vector<vector<int>>& adj) {
    // Inicializar todas las distancias como "no visitado" (-1)
    vector<int> dist(N, -1);
    
    // Cola FIFO para exploración por capas
    queue<int> q;
    
    // El nodo fuente está a distancia 0 de sí mismo
    dist[start] = 0;
    
    // Encolar el nodo inicial
    q.push(start);
    
    // Mientras haya nodos por explorar
    while (!q.empty()) {
        // Extraer el próximo nodo (FIFO: el más antiguo primero)
        int u = q.front();
        q.pop();
        
        // Iterar sobre todos los vecinos de u
        for (int v : adj[u]) {
            // Si v no ha sido visitado aún
            if (dist[v] == -1) {
                // La distancia a v es la distancia a u más 1
                dist[v] = dist[u] + 1;
                
                // Marcar al encolar (NO al sacar) — evita duplicados
                // dist[v] != -1 sirve como "visitado"
                q.push(v);
            }
        }
    }
    
    return dist;
    // Nodos con dist[v] == -1 son inalcanzables desde start
}
```

### Variante con grafo ponderado (ignorando pesos — solo pasos)

```cpp
// Cuando el grafo es {vecino, peso} pero quieres mínimos pasos
vector<int> bfs_weighted_steps(int start, int N, vector<vector<pair<int,int>>>& adj) {
    vector<int> dist(N, -1);
    queue<int> q;
    dist[start] = 0;
    q.push(start);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (auto [v, w] : adj[u]) {  // ignorar w
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                q.push(v);
            }
        }
    }
    return dist;
}
```

---

## 4. Complejidad — Desglose Completo

**Tiempo: $O(N + M)$**
- Cada nodo es encolado y desencolado exactamente **una vez**: $O(N)$
- Cada arista $(u, v)$ es examinada desde $u$ exactamente **una vez**: $O(M)$
  - En no dirigido: arista aparece dos veces (adj[u] y adj[v]), total $O(2M) = O(M)$
- Total: $O(N + M)$

**Espacio: $O(N + M)$**
- Cola: a lo sumo $O(N)$ nodos simultáneamente
- Array `dist`: $O(N)$
- Lista de adyacencia: $O(N + M)$

---

## 5. Variante: BFS en Rejilla 2D

Muy común en ICPC. El grafo es implícito: cada celda $(i,j)$ es un nodo, y los vecinos son las celdas adyacentes.

```cpp
// BFS en rejilla 2D — distancia mínima de (sr,sc) a (er,ec)
// Asumiendo que '.' es transitable y '#' es muro
// CPH Cap. 11 | CP4 §4.2

int bfs_grid(vector<string>& grid, int sr, int sc, int er, int ec) {
    int rows = grid.size();
    int cols = grid[0].size();
    
    // Las 4 direcciones: derecha, izquierda, abajo, arriba
    // Para 8 direcciones (diagonal): agregar {1,1},{1,-1},{-1,1},{-1,-1}
    int dx[] = {0, 0, 1, -1};
    int dy[] = {1, -1, 0, 0};
    
    // Matriz de distancias (-1 = no visitado)
    vector<vector<int>> dist(rows, vector<int>(cols, -1));
    
    // Verificar que el punto de inicio es válido
    if (grid[sr][sc] == '#') return -1;
    
    queue<pair<int,int>> q;
    dist[sr][sc] = 0;
    q.push({sr, sc});
    
    while (!q.empty()) {
        auto [r, c] = q.front(); q.pop();
        
        // Si llegamos al destino, retornar
        if (r == er && c == ec) return dist[r][c];
        
        for (int d = 0; d < 4; d++) {
            int nr = r + dx[d];  // fila del vecino
            int nc = c + dy[d];  // columna del vecino
            
            // Verificar que el vecino es válido:
            bool in_bounds = nr >= 0 && nr < rows && nc >= 0 && nc < cols;
            if (!in_bounds) continue;          // fuera del mapa
            if (grid[nr][nc] == '#') continue; // es muro
            if (dist[nr][nc] != -1) continue;  // ya visitado
            
            dist[nr][nc] = dist[r][c] + 1;
            q.push({nr, nc});
        }
    }
    
    return -1; // destino inalcanzable
}
```

**Conversión rejilla ↔ nodo lineal:**
```cpp
// Si prefieres un solo vector<int> para dist:
int node(int r, int c, int cols) { return r * cols + c; }
int row(int id, int cols) { return id / cols; }
int col(int id, int cols) { return id % cols; }
```

---

## 6. Variante: 0-1 BFS

Cuando las aristas tienen peso 0 o 1 (solo dos valores posibles), 0-1 BFS es más eficiente que Dijkstra: $O(N + M)$ vs $O(M \log N)$.

**Idea clave:** usar `deque` en lugar de `queue`:
- Arista con peso 0: `push_front` (mantener en "mismo nivel")
- Arista con peso 1: `push_back` (avanzar al siguiente nivel)

```cpp
// 0-1 BFS — CPH Cap. 13 | CPA: 0-1 bfs
// Para grafos con aristas de peso 0 o 1 SOLAMENTE
// Complejidad: O(N + M)

const int INF = 1e9;

vector<int> bfs_01(int start, int N, vector<vector<pair<int,int>>>& adj) {
    // adj[u] = {(v, w)} donde w ∈ {0, 1}
    vector<int> dist(N, INF);
    deque<int> dq;   // deque en lugar de queue
    
    dist[start] = 0;
    dq.push_back(start);
    
    while (!dq.empty()) {
        int u = dq.front(); dq.pop_front();
        
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                
                if (w == 0)
                    dq.push_front(v);   // peso 0: mismo nivel → frente
                else
                    dq.push_back(v);    // peso 1: siguiente nivel → atrás
            }
        }
    }
    
    return dist;
}
```

**¿Por qué funciona?**
- Las aristas de peso 0 no aumentan la distancia → el vecino está al "mismo nivel" → va al frente.
- Las aristas de peso 1 aumentan en 1 → el vecino está al "siguiente nivel" → va al fondo.
- La deque siempre mantiene los nodos ordenados por distancia (el invariante de BFS).

**Cuándo usar:**
- Convertir entre formas (costo 0) vs moverse (costo 1)
- "Puertas" que cuestan 1 en abrir pero las demás transiciones son gratuitas
- Variante del problema de Dijkstra cuando solo hay pesos 0 y 1

---

## 7. Variante: Multi-Source BFS

Cuando hay múltiples nodos fuente, encolar todos con distancia 0.

```cpp
// Multi-Source BFS — distancia mínima de cualquier fuente a cada nodo
// Aplicación: distancia mínima a la "costa" en un mapa de islas

vector<int> multi_source_bfs(vector<int>& sources, int N, vector<vector<int>>& adj) {
    vector<int> dist(N, -1);
    queue<int> q;
    
    // Encolar TODAS las fuentes con distancia 0
    for (int s : sources) {
        dist[s] = 0;
        q.push(s);
    }
    
    // BFS estándar desde aquí
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                q.push(v);
            }
        }
    }
    
    return dist;
}
```

**Aplicaciones:**
- Distancia de cada celda a la celda de agua más cercana
- Tiempo para que un "virus" infecte todo el grafo (fuentes = focos iniciales)
- Zona de influencia de múltiples ciudades

---

## 8. Variante: BFS con Estado Expandido

Para puzzles donde el "estado" incluye más que la posición actual.

```cpp
// BFS con estado (posición, llave) para problemas de llaves y puertas
// Estado = (nodo, máscara de llaves obtenidas)
// Nodo del BFS = {nodo_grafo, bitmask}

int bfs_with_state(int start, int N, int num_keys, 
                   vector<vector<pair<int,int>>>& adj,  // {vecino, tipo} tipo=-1 normal, >=0 llave
                   vector<vector<int>>& doors) {        // doors[u] = máscara requerida
    
    int states = 1 << num_keys;
    vector<vector<int>> dist(N, vector<int>(states, -1));
    
    queue<pair<int,int>> q;  // {nodo, máscara}
    dist[start][0] = 0;
    q.push({start, 0});
    
    while (!q.empty()) {
        auto [u, mask] = q.front(); q.pop();
        
        for (auto [v, key] : adj[u]) {
            // Verificar si podemos pasar por la puerta de v
            // (omitido por brevedad — depende del problema)
            
            int new_mask = mask;
            if (key >= 0) new_mask |= (1 << key);  // recogemos una llave
            
            if (dist[v][new_mask] == -1) {
                dist[v][new_mask] = dist[u][mask] + 1;
                q.push({v, new_mask});
            }
        }
    }
    
    // Retornar distancia con todas las llaves
    int full_mask = states - 1;
    return dist[N-1][full_mask];  // asumiendo que destino es N-1
}
```

---

## 9. Reconstrucción del Camino

```cpp
// BFS + reconstrucción de camino mínimo
pair<int, vector<int>> bfs_with_path(int start, int end, int N, vector<vector<int>>& adj) {
    vector<int> dist(N, -1);
    vector<int> prev(N, -1);  // predecesor en el camino mínimo
    queue<int> q;
    
    dist[start] = 0;
    q.push(start);
    
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                prev[v] = u;          // guardar de dónde vinimos
                q.push(v);
            }
        }
    }
    
    if (dist[end] == -1) return {-1, {}};  // inalcanzable
    
    // Reconstruir camino desde end hasta start
    vector<int> path;
    for (int v = end; v != -1; v = prev[v])
        path.push_back(v);
    reverse(path.begin(), path.end());  // invertir para start→end
    
    return {dist[end], path};
}
```

---

## 10. Ejemplo Resuelto Paso a Paso

**Problema:** Dado el grafo:
```
Nodos: 0, 1, 2, 3, 4, 5
Aristas: (0,1), (0,2), (1,3), (2,3), (3,4), (4,5)
Fuente: 0
```

**Ejecución:**

| Paso | Cola (frente→atrás) | dist[0..5] | Acción |
|------|---------------------|-------------|--------|
| Init | [0] | [0,-1,-1,-1,-1,-1] | Encolar 0 |
| 1 | [1,2] | [0,1,1,-1,-1,-1] | Sacar 0, encolar 1,2 |
| 2 | [2,3] | [0,1,1,2,-1,-1] | Sacar 1, 0 ya visitado, encolar 3 |
| 3 | [3] | [0,1,1,2,-1,-1] | Sacar 2, 0 ya visitado, 3 ya visitado |
| 4 | [4] | [0,1,1,2,3,-1] | Sacar 3, encolar 4 |
| 5 | [5] | [0,1,1,2,3,4] | Sacar 4, encolar 5 |
| 6 | [] | [0,1,1,2,3,4] | Sacar 5, sin vecinos no visitados |

**Resultado:** dist = [0, 1, 1, 2, 3, 4]

---

## 11. Trampas Comunes y Fixes

### Trampa 1: Marcar al sacar en lugar de al encolar

```cpp
// MAL: Marcar visitado cuando sacas
while (!q.empty()) {
    int u = q.front(); q.pop();
    visited[u] = true;         // ← TARDE! Ya pudimos encolar u múltiples veces
    for (int v : adj[u]) {
        if (!visited[v]) q.push(v);  // v puede encolarse N veces
    }
}

// BIEN: Marcar visitado cuando encolas
dist[start] = 0;
q.push(start);
while (!q.empty()) {
    int u = q.front(); q.pop();
    for (int v : adj[u]) {
        if (dist[v] == -1) {   // ← verificar al encolar
            dist[v] = dist[u] + 1;
            q.push(v);
        }
    }
}
```

**Síntoma:** TLE o respuestas incorrectas. El grafo denso explota la cola.

---

### Trampa 2: No manejar grafo desconectado

```cpp
// MAL: BFS desde un solo nodo, asumir que llega a todos
vector<int> dist = bfs(0, N, adj);
// Si el grafo tiene componentes separadas, algunos dist[v] = -1

// BIEN: si necesitas visitar todos los nodos
for (int i = 0; i < N; i++) {
    if (dist[i] == -1) {  // componente no visitada
        bfs_from(i, ...);
    }
}
```

---

### Trampa 3: Overflow de distancias

```cpp
// MAL: dist[v] + 1 puede desbordarse si dist[v] es INF (1e9)
if (dist[u] + 1 < dist[v]) dist[v] = dist[u] + 1;

// BIEN: en BFS estándar no pasa porque dist es -1 (no INF)
// Pero en 0-1 BFS con INF:
if (dist[u] < INF && dist[u] + w < dist[v]) dist[v] = dist[u] + w;
```

---

### Trampa 4: Aristas dirigidas en grafo no dirigido

```cpp
// MAL: solo agregar en una dirección para un grafo no dirigido
adj[u].push_back(v);  // olvidé agregar v→u

// BIEN:
adj[u].push_back(v);
adj[v].push_back(u);  // siempre en ambas direcciones si no dirigido
```

**Síntoma:** BFS no llega a nodos que deberían ser alcanzables.

---

### Trampa 5: Usar int cuando la distancia puede ser grande

```cpp
// Si N = 10^6 y el camino más largo tiene N-1 aristas:
// dist máxima ≈ 10^6 — cabe en int.
// Pero si hay pesos (0-1 BFS) y pesos = 1 → dist máxima = N, OK.
// Si el problema combina distancias con otros valores → usar long long.
```

---

## 12. Checklist Pre-Submit para BFS

```
[ ] ¿La inicialización de dist es -1 (o INF para 0-1 BFS)?
[ ] ¿Marqué dist[start] = 0 y encolé start ANTES del loop?
[ ] ¿Verifico dist[v] == -1 al encolar (no al sacar)?
[ ] ¿El grafo es dirigido o no dirigido? ¿Agregué aristas en ambas direcciones si corresponde?
[ ] ¿Manejo múltiples componentes (iterar sobre todos los nodos)?
[ ] ¿El resultado para nodos inalcanzables es correcto (-1, INF, o lo que pide)?
[ ] ¿Para 0-1 BFS: use deque, push_front para peso 0, push_back para peso 1?
[ ] ¿Para rejilla: verifico in_bounds ANTES de acceder a grid[nr][nc]?
[ ] ¿Hay overflow posible en las distancias?
[ ] ¿La respuesta que devuelvo es la correcta (distancia, contador, booleano)?
```

---

## 13. Complejidad Resumen

| Variante | Tiempo | Espacio | Estructura |
|----------|--------|---------|-----------|
| BFS estándar | $O(N+M)$ | $O(N)$ | `queue` |
| BFS en rejilla | $O(N \cdot M_{\text{cols}})$ | $O(N \cdot M_{\text{cols}})$ | `queue` |
| 0-1 BFS | $O(N+M)$ | $O(N)$ | `deque` |
| Multi-Source BFS | $O(N+M)$ | $O(N)$ | `queue` |
| BFS + camino | $O(N+M)$ | $O(N)$ | `queue` + `prev[]` |

---

## 14. Cuándo NO Usar BFS

| Situación | Usar en cambio |
|-----------|---------------|
| Aristas con pesos distintos | Dijkstra |
| Aristas con pesos negativos | Bellman-Ford |
| Pesos 0 o 1 | 0-1 BFS (más eficiente) |
| Todos los pares de distancias | Floyd-Warshall |
| Necesitas explorar en profundidad primero | DFS |

---

## 🔗 Relacionado

- [[03_DFS]]
- [[04_DIJKSTRA]]
- [[icpc/temas/GRAPHS_ICPC/01_RECETA_UNIVERSAL]]
- [[12_BIPARTICION]]
- [[10_TOPOLOGICO]]
- [[18_CASOS_EDGE]]

---
titulo: "Representación de Grafos en Código"
tipo: icpc-tema
categoria: grafos
estado: en-progreso
etiquetas: [icpc, icpc/tema, icpc/categoria/grafos]
fuente-cph: "Cap. 11"
fuente-cp4: "§4.1"
creado: 2026-04-17
actualizado: 2026-04-17
---

# Representación de Grafos en Código

> CPH Cap. 11 | CP4 §4.1

La elección de la representación del grafo afecta la eficiencia y la simplicidad del código. Esta guía cubre las tres representaciones principales con código completo de lectura.

---

## 1. Lista de Adyacencia

La representación más versátil y la más usada en ICPC.

```cpp
// =========================================
// LISTA DE ADYACENCIA — La representación estándar
// =========================================

// NO PONDERADO — No dirigido
vector<vector<int>> adj(N);
for (int i = 0; i < M; i++) {
    int u, v; cin >> u >> v; u--; v--;
    adj[u].push_back(v);
    adj[v].push_back(u);  // ambas direcciones
}

// NO PONDERADO — Dirigido
vector<vector<int>> adj(N);
for (int i = 0; i < M; i++) {
    int u, v; cin >> u >> v; u--; v--;
    adj[u].push_back(v);  // solo una dirección
}

// PONDERADO — No dirigido
vector<vector<pair<int,int>>> adj(N);  // {vecino, peso}
for (int i = 0; i < M; i++) {
    int u, v, w; cin >> u >> v >> w; u--; v--;
    adj[u].push_back({v, w});
    adj[v].push_back({u, w});
}

// PONDERADO — Dirigido
vector<vector<pair<int,int>>> adj(N);
for (int i = 0; i < M; i++) {
    int u, v, w; cin >> u >> v >> w; u--; v--;
    adj[u].push_back({v, w});
}

// Acceder a los vecinos de u:
for (int v : adj[u]) { /* ... */ }           // no ponderado
for (auto [v, w] : adj[u]) { /* ... */ }    // ponderado (C++17)
for (auto& p : adj[u]) { int v=p.first, w=p.second; } // C++11
```

**Complejidad de operaciones:**
| Operación | Complejidad |
|-----------|-------------|
| Acceder a vecinos de $u$ | $O(\text{grado}(u))$ |
| Verificar si $(u,v)$ existe | $O(\text{grado}(u))$ |
| Iterar todas las aristas | $O(N + M)$ |
| Espacio | $O(N + M)$ |

**Cuándo usar:**
- Grafos dispersos ($M \approx N$ o $M \approx N \log N$)
- BFS, DFS, Dijkstra, Prim, Kruskal, cualquier algoritmo de travesía
- La mayoría de los problemas ICPC

---

## 2. Matriz de Adyacencia

```cpp
// =========================================
// MATRIZ DE ADYACENCIA
// =========================================

// NO PONDERADO — presencia de arista
const int MAXN = 1005;
bool adj_mat[MAXN][MAXN] = {};  // false por defecto

// PONDERADO — con INF si no hay arista
const int INF = 1e9;
int dist[MAXN][MAXN];

// Inicializar para Floyd-Warshall:
void init_matrix(int N) {
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++)
            dist[i][j] = (i == j) ? 0 : INF;
}

// Leer aristas:
for (int i = 0; i < M; i++) {
    int u, v, w; cin >> u >> v >> w; u--; v--;
    dist[u][v] = min(dist[u][v], w);  // tomar mínimo si hay aristas múltiples
    dist[v][u] = min(dist[v][u], w);  // si no dirigido
}

// Acceder a si existe arista (u,v): O(1)
if (adj_mat[u][v]) { /* existe arista */ }
if (dist[u][v] != INF) { /* existe arista */ }

// Iterar vecinos de u: O(N)
for (int v = 0; v < N; v++) {
    if (adj_mat[u][v]) { /* v es vecino de u */ }
}
```

**Complejidad de operaciones:**
| Operación | Complejidad |
|-----------|-------------|
| Verificar si $(u,v)$ existe | $O(1)$ |
| Acceder a vecinos de $u$ | $O(N)$ |
| Iterar todas las aristas | $O(N^2)$ |
| Espacio | $O(N^2)$ |

**Cuándo usar:**
- Floyd-Warshall (necesita acceso $O(1)$ a `dist[i][j]`)
- Grafos densos ($M \approx N^2$)
- $N \leq 1000$ (para que $N^2 \leq 10^6$ en memoria)
- Cuando necesitas verificar rápidamente si existe arista

**No usar cuando:** $N > 10^4$ (la matriz sería $10^8$ bytes = 100 MB, demasiado)

---

## 3. Edge List (Lista de Aristas)

```cpp
// =========================================
// EDGE LIST — Lista de aristas
// =========================================

// Con peso: {peso, u, v} — peso primero para sort natural
vector<tuple<int,int,int>> edges;  // {w, u, v}
for (int i = 0; i < M; i++) {
    int u, v, w; cin >> u >> v >> w; u--; v--;
    edges.push_back({w, u, v});
    // Si no dirigido y necesitas ambas: edges.push_back({w, v, u});
    // Pero para Kruskal NO agregar en ambas direcciones (una sola arista)
}

// Ordenar por peso:
sort(edges.begin(), edges.end());  // ordena por primer elemento (peso)

// Acceder a elementos:
for (auto [w, u, v] : edges) { /* ... */ }  // C++17
for (auto& e : edges) { int w=get<0>(e), u=get<1>(e), v=get<2>(e); }  // C++11

// Sin peso: {u, v}
vector<pair<int,int>> edges;
for (int i = 0; i < M; i++) {
    int u, v; cin >> u >> v; u--; v--;
    edges.push_back({u, v});
}

// Para Bellman-Ford con struct:
struct Edge { int u, v, w; };
vector<Edge> edges;
for (int i = 0; i < M; i++) {
    int u, v, w; cin >> u >> v >> w; u--; v--;
    edges.push_back({u, v, w});
}
```

**Complejidad de operaciones:**
| Operación | Complejidad |
|-----------|-------------|
| Iterar todas las aristas | $O(M)$ |
| Ordenar por peso | $O(M \log M)$ |
| Acceder a vecinos de $u$ | $O(M)$ |
| Espacio | $O(M)$ |

**Cuándo usar:**
- Kruskal (necesita aristas ordenadas por peso)
- Bellman-Ford (relaja todas las aristas en cada iteración)
- Cuando el algoritmo opera sobre aristas, no sobre vecinos

---

## 4. Grafo Implícito (Rejilla)

Para problemas de rejilla, el grafo no necesita construirse explícitamente.

```cpp
// =========================================
// GRAFO IMPLÍCITO — Rejilla 2D
// =========================================

int rows, cols;
vector<string> grid;

// Las 4 o 8 direcciones
int dx4[] = {0, 0, 1, -1};          // 4 direcciones (arriba, abajo, izq, der)
int dy4[] = {1, -1, 0, 0};

int dx8[] = {0, 0, 1, -1, 1, 1, -1, -1};  // 8 direcciones (incluye diagonal)
int dy8[] = {1, -1, 0, 0, 1, -1, 1, -1};

// Verificar que (nr, nc) es una celda válida y transitable
bool valid(int r, int c) {
    return r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c] != '#';
}

// Conversión celda ↔ índice (si necesitas un vector<int> de dist)
int to_id(int r, int c) { return r * cols + c; }
int to_row(int id) { return id / cols; }
int to_col(int id) { return id % cols; }

// BFS estándar en rejilla:
void bfs_grid(int start_r, int start_c) {
    vector<vector<int>> dist(rows, vector<int>(cols, -1));
    queue<pair<int,int>> q;
    dist[start_r][start_c] = 0;
    q.push({start_r, start_c});
    
    while (!q.empty()) {
        auto [r, c] = q.front(); q.pop();
        for (int d = 0; d < 4; d++) {
            int nr = r + dx4[d], nc = c + dy4[d];
            if (valid(nr, nc) && dist[nr][nc] == -1) {
                dist[nr][nc] = dist[r][c] + 1;
                q.push({nr, nc});
            }
        }
    }
}
```

---

## 5. Tabla de Decisión

```
¿Cuántos nodos N?
├── N > 10^4 → NO usar matriz de adyacencia
├── N ≤ 500 → Floyd-Warshall: usar matriz dist[][]
└── Cualquier N → lista de adyacencia es segura

¿Qué algoritmo necesitas?
├── BFS, DFS, Dijkstra, Prim, Tarjan, Kosaraju → lista de adyacencia
├── Kruskal, Bellman-Ford → edge list
├── Floyd-Warshall → matriz de adyacencia
├── Verificar existencia de arista O(1) → matriz de adyacencia
└── Grafo de rejilla → implícito (no construir la lista)

¿Qué operaciones dominan?
├── Iterar vecinos → lista de adyacencia
├── Iterar TODAS las aristas → edge list
├── Acceso aleatorio a aristas → matriz de adyacencia
└── Ordenar aristas por peso → edge list
```

---

## 6. Tips de Implementación para Concursos

### Indexación 0-based vs 1-based

```cpp
// El código interno usa 0-based (más natural en C++)
// Convertir al leer:
int u, v; cin >> u >> v;
u--; v--;  // convertir de 1-based (input) a 0-based (código)

// Convertir al imprimir:
cout << ans + 1 << "\n";  // convertir de 0-based a 1-based (output)
```

### Evitar MLE con la Matriz

```cpp
// Para N = 10^3: int dist[1000][1000] → 4 * 10^6 bytes = 4 MB ✓
// Para N = 10^4: int dist[10000][10000] → 4 * 10^8 bytes = 400 MB ✗

// Si necesitas N = 2000 y Floyd-Warshall:
// dist[] como variable global (no en stack)
const int MAXN = 2005;
long long dist[MAXN][MAXN];  // global: 2000² * 8 bytes = 32 MB ✓
```

### Template Completo para Concursos

```cpp
#include <bits/stdc++.h>
using namespace std;

// Ajustar según el problema:
const int MAXN = 100005;
const long long LINF = 1e18;

int N, M;
vector<vector<pair<int,int>>> adj;  // lista adj ponderada (la más versátil)

void read_undirected() {
    cin >> N >> M;
    adj.assign(N, {});
    for (int i = 0; i < M; i++) {
        int u, v, w; cin >> u >> v >> w; u--; v--;
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});
    }
}

void read_directed() {
    cin >> N >> M;
    adj.assign(N, {});
    for (int i = 0; i < M; i++) {
        int u, v, w; cin >> u >> v >> w; u--; v--;
        adj[u].push_back({v, w});
    }
}

void read_unweighted_undirected() {
    cin >> N >> M;
    adj.assign(N, {});
    for (int i = 0; i < M; i++) {
        int u, v; cin >> u >> v; u--; v--;
        adj[u].push_back({v, 1});
        adj[v].push_back({u, 1});
    }
}

void read_tree() {
    cin >> N;
    adj.assign(N, {});
    for (int i = 0; i < N-1; i++) {
        int u, v, w = 1; cin >> u >> v; u--; v--;
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});
    }
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    read_undirected();  // cambiar según el problema
    
    // Tu solución aquí
    
    return 0;
}
```

---

## 🔗 Relacionado

- [[icpc/temas/GRAPHS_ICPC/00_INTRODUCCION]]
- [[icpc/temas/GRAPHS_ICPC/01_RECETA_UNIVERSAL]]
- [[02_BFS]]
- [[07_MST]]
- [[06_FLOYD_WARSHALL]]

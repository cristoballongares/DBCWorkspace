---
titulo: "Optimizaciones Avanzadas en Grafos"
tipo: icpc-tema
categoria: grafos
estado: en-progreso
etiquetas: [icpc, icpc/tema, icpc/categoria/grafos]
fuente-cph: "Cap. 18-20"
fuente-cp4: "§4.7-4.9"
creado: 2026-04-17
actualizado: 2026-04-17
---

# Optimizaciones Avanzadas en Grafos

> Técnicas para hacer los algoritmos más rápidos y elegantes.

---

## 1. 0-1 BFS vs Dijkstra vs BFS Estándar

Cuándo usar cada variante de BFS:

| Condición | Algoritmo | Complejidad | Estructura |
|-----------|-----------|-------------|-----------|
| Todos los pesos = 1 | BFS | $O(N+M)$ | `queue` |
| Pesos ∈ {0, 1} | 0-1 BFS | $O(N+M)$ | `deque` |
| Pesos ≥ 0 arbitrarios | Dijkstra | $O(M \log N)$ | `priority_queue` |
| Pesos negativos | Bellman-Ford | $O(N \cdot M)$ | Edge list |

```cpp
// Cuándo 0-1 BFS brilla (y gana a Dijkstra):
// - Moverse cuesta 0, abrir una puerta cuesta 1
// - Tipo de arista: "libre" o "bloqueada"
// - Teleportación gratuita vs movimiento pagado

// Ejemplo: Laberinto donde moverse cuesta 0, romper paredes cuesta 1
// → 0-1 BFS: O(N*M) en vez de Dijkstra O(N*M*log(N*M))
```

---

## 2. DSU con Union by Size vs Union by Rank

```cpp
// Union by Size (alternativa a union by rank):
// En lugar de mantener rank, mantener el tamaño sz[]
// El árbol más pequeño se une bajo el más grande

struct DSU_by_size {
    vector<int> parent, sz;
    
    DSU_by_size(int n) : parent(n), sz(n, 1) {
        iota(parent.begin(), parent.end(), 0);
    }
    
    int find(int x) {
        return parent[x] == x ? x : parent[x] = find(parent[x]);
    }
    
    bool unite(int x, int y) {
        x = find(x); y = find(y);
        if (x == y) return false;
        if (sz[x] < sz[y]) swap(x, y);
        parent[y] = x;
        sz[x] += sz[y];
        return true;
    }
    
    int size(int x) { return sz[find(x)]; }
};

// Union by size es equivalente a union by rank en la práctica.
// Ventaja: sz[] es más informativo (sabes el tamaño exacto del componente).
```

---

## 3. DSU con Rollback — Para Divide y Vencerás Offline

```cpp
// DSU con rollback — O(log N) por operación (sin path compression)
// Permite "deshacer" uniones → útil para D&C offline

struct DSU_Rollback {
    vector<int> parent, rank_, sz;
    vector<pair<int*,int>> history;
    
    DSU_Rollback(int n) : parent(n), rank_(n, 0), sz(n, 1) {
        iota(parent.begin(), parent.end(), 0);
    }
    
    int find(int x) {
        // Iterativo SIN path compression (necesario para rollback)
        while (parent[x] != x) x = parent[x];
        return x;
    }
    
    void save_state(int* ptr) {
        history.push_back({ptr, *ptr});
    }
    
    bool unite(int x, int y) {
        x = find(x); y = find(y);
        if (x == y) return false;
        if (rank_[x] < rank_[y]) swap(x, y);
        save_state(&parent[y]);
        save_state(&sz[x]);
        if (rank_[x] == rank_[y]) save_state(&rank_[x]);
        parent[y] = x;
        sz[x] += sz[y];
        if (rank_[x] == rank_[y]) rank_[x]++;
        return true;
    }
    
    int checkpoint() { return history.size(); }
    
    void rollback(int cp) {
        while ((int)history.size() > cp) {
            *history.back().first = history.back().second;
            history.pop_back();
        }
    }
};

// Uso en D&C offline:
// Para procesar aristas en un rango de tiempo [l, r]:
// - Agrega aristas del rango al DSU
// - Procesa queries en ese rango
// - Hace rollback para quitar las aristas
```

---

## 4. Euler Tour (DFS Order) para Queries de Subárbol

```cpp
// Euler Tour: convertir subárbol en rango contiguo en un array
// Permite aplicar Segment Trees para queries de subárbol

int timer_et = 0;
int tin_et[MAXN], tout_et[MAXN];

void euler_tour(int v, int p) {
    tin_et[v] = timer_et++;   // entrada: inicio del rango de v
    for (int u : adj[v]) {
        if (u != p) euler_tour(u, v);
    }
    tout_et[v] = timer_et++;  // salida: fin del rango de v
}

// Después:
// El subárbol de v corresponde al rango [tin_et[v], tout_et[v]) en el array
// Aplicar Seg. Tree sobre este rango para queries de subárbol

// ¿v es ancestro de u?
bool is_ancestor(int v, int u) {
    return tin_et[v] <= tin_et[u] && tout_et[u] <= tout_et[v];
}

// Rango del subárbol de v:
// [tin_et[v], tin_et[v] + sz[v] - 1]
// donde sz[v] es el tamaño del subárbol
```

---

## 5. Binary Lifting — K-ésimo Ancestro

```cpp
// Binary Lifting para K-ésimo ancestro — O(log N) por query
// CPH Cap. 18 | CPA: binary-lifting

const int LOG = 17;
int ancestor[LOG][MAXN];  // ancestor[k][v] = 2^k-ésimo ancestro de v

void build_ancestor(int root, int N) {
    // DFS para inicializar ancestor[0][] y depth[]
    // ancestor[0][v] = padre directo
    
    for (int k = 1; k < LOG; k++)
        for (int v = 1; v <= N; v++)
            ancestor[k][v] = ancestor[k-1][ancestor[k-1][v]];
}

// K-ésimo ancestro de v
int kth_ancestor(int v, int k) {
    for (int i = 0; i < LOG; i++)
        if ((k >> i) & 1)
            v = ancestor[i][v];
    return v;
}

// Aplicaciones:
// - LCA (ver 14_ARBOLES_ESPECIALES.md)
// - Encontrar el ancestro más lejano dentro de una distancia k
// - Saltar en un árbol funcional (cada nodo tiene exactamente un "siguiente")
```

---

## 6. Sparse Table — RMQ para LCA

```cpp
// Sparse Table para Range Minimum Query — O(N log N) build, O(1) query
// CPA: sparse-table

int sparse[LOG][MAXN];  // sparse[k][i] = min en [i, i + 2^k - 1]
int log2_floor[MAXN];   // log2_floor[n] = floor(log2(n))

void build_sparse(vector<int>& arr, int n) {
    for (int i = 0; i < n; i++) sparse[0][i] = arr[i];
    
    for (int k = 1; (1 << k) <= n; k++)
        for (int i = 0; i + (1 << k) <= n; i++)
            sparse[k][i] = min(sparse[k-1][i], sparse[k-1][i + (1 << (k-1))]);
    
    // Precomputar log2
    log2_floor[1] = 0;
    for (int i = 2; i <= n; i++)
        log2_floor[i] = log2_floor[i/2] + 1;
}

// Query: min en [l, r]
int rmq(int l, int r) {
    int k = log2_floor[r - l + 1];
    return min(sparse[k][l], sparse[k][r - (1 << k) + 1]);
}

// Uso para LCA:
// Hacer Euler Tour del árbol (2N-1 elementos)
// Sparse Table sobre los niveles del Euler Tour
// LCA(u,v) = nodo con mínimo nivel en euler[first[u]..first[v]]
```

---

## 7. Técnica: Suma de Prefijos en Árbol (Tree Path Prefix Sums)

```cpp
// Para consultas de suma en caminos raíz-a-nodo:
// prefix[v] = suma de pesos en el camino de la raíz a v

vector<long long> prefix;

void dfs_prefix(int v, int p, long long sum) {
    prefix[v] = sum + edge_weight_to_v;
    for (auto [u, w] : adj[v]) {
        if (u != p) dfs_prefix(u, v, prefix[v]);
    }
}

// Suma en camino entre u y v:
// = prefix[u] + prefix[v] - 2 * prefix[LCA(u,v)] + weight[LCA(u,v)]
// (o sin el peso de LCA si las sumas son de aristas)
```

---

## 8. Eliminación de Nodos en MST — Bitmask DP

Para problemas de Steiner Tree (MST que conecta un subconjunto de nodos).

```cpp
// Steiner Tree DP — O(3^k * V + 2^k * V * E)
// k = número de terminales (nodos que DEBEN estar conectados)
// Útil cuando k es pequeño (k <= 10)

// dp[S][v] = mínimo costo de árbol que:
//   - conecta todos los terminales en el conjunto S
//   - tiene v como raíz (o contiene v)

vector<vector<long long>> dp_steiner(2^k, vector<long long>(N, LINF));

// Transición 1: combinar dos árboles en el nodo v
for (int S = 1; S < (1<<k); S++)
    for (int v = 0; v < N; v++)
        for (int sub = (S-1)&S; sub > 0; sub = (sub-1)&S)
            dp[S][v] = min(dp[S][v], dp[sub][v] + dp[S^sub][v]);

// Transición 2: Dijkstra para propagar el árbol a otros nodos
for (int S = 1; S < (1<<k); S++)
    dijkstra_on_dp(S);  // relajar dp[S][v] usando las aristas del grafo
```

---

## 9. Técnicas de Programación Avanzada

### Virtual Source/Sink

```cpp
// Cuando tienes múltiples fuentes o sumideros:
// Agregar un "super-nodo" virtual con aristas de capacidad ∞ (o ajustada)

int super_source = N;  // nodo virtual (índice N)
int super_sink = N + 1;

// Para cada fuente real s_i:
mf.add_edge(super_source, s_i, INF);

// Para cada sumidero real t_i:
mf.add_edge(t_i, super_sink, INF);

// max_flow(super_source, super_sink) = flujo máximo total
```

### Node Splitting — Capacidad en Vértices

```cpp
// Para modelar capacidad en nodos (no solo aristas):
// Dividir cada nodo v en v_in y v_out
// Agregar arista interna: v_in → v_out con capacidad = capacidad del nodo

// Para arista original (u, v):
// → arista de u_out a v_in

// Numeración: v_in = 2*v, v_out = 2*v+1
void add_vertex_capacity(MaxFlow& mf, int v, long long cap) {
    mf.add_edge(2*v, 2*v+1, cap);  // arista interna
}

void add_edge_with_split(MaxFlow& mf, int u, int v, long long cap) {
    mf.add_edge(2*u+1, 2*v, cap);  // u_out → v_in
}
```

---

## 10. Optimizaciones de Implementación

### Leer Grafos Grandes Rápido

```cpp
// Usar ios_base::sync_with_stdio(false) y cin.tie(NULL)
// Esto es OBLIGATORIO para N, M = 10^6
ios_base::sync_with_stdio(false);
cin.tie(NULL);
```

### Reservar Memoria en la Lista de Adyacencia

```cpp
// Para grafos muy grandes (N, M = 10^6):
// Reservar memoria de antemano evita reallocations costosas
vector<vector<pair<int,int>>> adj(N);
for (int i = 0; i < N; i++) adj[i].reserve(expected_degree);
```

### Usar `emplace_back` en Lugar de `push_back`

```cpp
// Más eficiente para structs/pairs complejos
adj[u].emplace_back(v, w);  // construye el pair in-place
```

### Evitar Copias en los Loops

```cpp
// MAL: copia el pair en cada iteración
for (pair<int,int> p : adj[u]) { ... }

// BIEN: referencia constante
for (const auto& [v, w] : adj[u]) { ... }
// O simplemente:
for (auto [v, w] : adj[u]) { ... }  // copia barata para pair<int,int>
```

---

## 11. Tabla de Límites Prácticos

| Complejidad | N máximo (1s) | N máximo (2s) |
|-------------|--------------|--------------|
| $O(N)$ | $10^8$ | $2 \times 10^8$ |
| $O(N \log N)$ | $5 \times 10^6$ | $10^7$ |
| $O(N \sqrt{N})$ | $10^5$ | $2 \times 10^5$ |
| $O(N^2)$ | $10^4$ | $1.5 \times 10^4$ |
| $O(N^2 \log N)$ | $3 \times 10^3$ | $5 \times 10^3$ |
| $O(N^3)$ | $500$ | $700$ |
| $O(2^N \cdot N)$ | $20$ | $22$ |

Nota: estas son aproximaciones; el factor constante importa mucho.

---

## 🔗 Relacionado

- [[08_COMPONENTES]]
- [[14_ARBOLES_ESPECIALES]]
- [[13_FLUJO]]
- [[02_BFS]]
- [[20_CHEAT_SHEET]]

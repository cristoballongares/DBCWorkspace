---
titulo: "Componentes Conexas y Union-Find (DSU)"
tipo: icpc-tema
categoria: grafos
estado: en-progreso
etiquetas: [icpc, icpc/tema, icpc/categoria/grafos]
fuente-cph: "Cap. 15"
fuente-cp4: "§2.4.2"
creado: 2026-04-17
actualizado: 2026-04-17
---

# Componentes Conexas y Union-Find (DSU)

> CPH Cap. 15 | CP4 §2.4.2 | CPA: dsu

Las componentes conexas son los subgrafos conexos maximales. Union-Find (DSU — Disjoint Set Union) es la estructura más eficiente para mantener y consultar componentes dinámicamente.

---

## 1. Componentes con BFS/DFS

La forma más directa: ejecutar BFS/DFS desde cada nodo no visitado.

```cpp
// Contar e identificar componentes — O(N+M)

int N, M;
vector<vector<int>> adj(N);
vector<int> component(N, -1);  // componente de cada nodo (-1 = sin asignar)
int num_components = 0;

// BFS para identificar una componente desde un nodo inicial
void bfs_component(int start, int comp_id) {
    queue<int> q;
    component[start] = comp_id;
    q.push(start);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) {
            if (component[v] == -1) {
                component[v] = comp_id;
                q.push(v);
            }
        }
    }
}

// Identificar todas las componentes
for (int i = 0; i < N; i++) {
    if (component[i] == -1) {
        bfs_component(i, num_components++);
    }
}

// Resultado:
// num_components = número de componentes conexas
// component[v] = ID de la componente a la que pertenece v (0-indexed)
```

---

## 2. Union-Find (DSU) — Implementación Completa

DSU es más eficiente para **consultas online** (agregar aristas dinámicamente y responder si dos nodos están conectados).

```cpp
// DSU con Path Compression + Union by Rank
// CPH Cap. 15 | CP4 §2.4.2
// Complejidad amortizada: O(α(N)) por operación (casi O(1))

struct DSU {
    vector<int> parent;   // parent[x] = padre de x en el árbol DSU
    vector<int> rank_;    // rank_[x] = cota superior de la altura del subárbol de x
    vector<int> sz;       // sz[x] = tamaño del componente raíz x
    int components;       // número de componentes actuales
    
    // Constructor: N nodos, cada uno en su propio componente
    DSU(int n) : parent(n), rank_(n, 0), sz(n, 1), components(n) {
        iota(parent.begin(), parent.end(), 0);  // parent[i] = i
    }
    
    // Encontrar la raíz del componente de x
    // Path compression: todos los nodos en el camino apuntan directo a la raíz
    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);  // path compression recursiva
        return parent[x];
    }
    
    // Unir los componentes de x e y
    // Union by rank: el árbol más "alto" se convierte en raíz
    // Retorna true si se unieron (estaban en componentes distintos)
    //         false si ya estaban en el mismo componente
    bool unite(int x, int y) {
        x = find(x);
        y = find(y);
        
        if (x == y) return false;  // misma raíz → mismo componente → no unir
        
        // Union by rank: hacer que x sea la raíz del árbol más alto
        if (rank_[x] < rank_[y]) swap(x, y);
        
        parent[y] = x;          // y apunta a x
        sz[x] += sz[y];         // actualizar tamaño
        
        if (rank_[x] == rank_[y]) rank_[x]++;  // mismo rango → subir rango de x
        
        components--;
        return true;
    }
    
    // ¿Están x e y en el mismo componente?
    bool connected(int x, int y) { return find(x) == find(y); }
    
    // Tamaño del componente que contiene x
    int size(int x) { return sz[find(x)]; }
    
    // Número actual de componentes
    int num_components() { return components; }
};
```

### Uso Básico

```cpp
int main() {
    int N = 5;
    DSU dsu(N);
    
    // Agregar aristas
    dsu.unite(0, 1);  // une {0} y {1} → {0,1}
    dsu.unite(1, 2);  // une {0,1} y {2} → {0,1,2}
    dsu.unite(3, 4);  // une {3} y {4} → {3,4}
    
    // Consultas
    cout << dsu.connected(0, 2) << "\n";  // true  (0,1,2 están juntos)
    cout << dsu.connected(0, 3) << "\n";  // false (componentes distintos)
    cout << dsu.num_components() << "\n"; // 2 ({0,1,2} y {3,4})
    cout << dsu.size(0) << "\n";          // 3 (componente de 0 tiene 3 nodos)
    
    return 0;
}
```

---

## 3. Por Qué Path Compression es O(α(N))

### Función de Ackermann Inversa

$\alpha(N)$ es la función de Ackermann inversa. Para cualquier $N$ que aparece en la práctica:
- $\alpha(1) = 0$
- $\alpha(2^{65536}) \leq 5$

En términos prácticos, $\alpha(N) \leq 4$ para toda $N$ que un computador pueda manejar. Es **efectivamente constante**.

### Intuición

- **Sin optimizaciones:** `find` puede ser $O(N)$ en el peor caso (árbol lineal).
- **Con path compression:** después del primer `find`, todos los nodos en el camino apuntan directamente a la raíz. Las siguientes llamadas son $O(1)$.
- **Con union by rank:** garantiza que los árboles tengan profundidad $O(\log N)$ sin path compression.
- **Combinados:** se obtiene $O(\alpha(N))$ amortizado.

```
Sin path compression:
  parent: 0←1←2←3←4←5   (cadena larga)
  find(5): 5→4→3→2→1→0 (6 pasos)

Con path compression (después del find):
  parent: 0←1, 0←2, 0←3, 0←4, 0←5
  find(5): 5→0 (1 paso, todos apuntan directo a la raíz)
```

---

## 4. Variante: DSU con Rollback (Sin Path Compression)

Para problemas donde necesitas **deshacer** operaciones de unión (offline con divide y vencerás). Sin path compression para poder revertir.

```cpp
// DSU con rollback — O(log N) por operación (sin path compression)
// Útil para: offline connectivity, divide-and-conquer en grafos

struct DSU_Rollback {
    vector<int> parent, rank_, sz;
    vector<pair<int*,int>> history;  // historial para rollback: {ptr, valor_anterior}
    
    DSU_Rollback(int n) : parent(n), rank_(n, 0), sz(n, 1) {
        iota(parent.begin(), parent.end(), 0);
    }
    
    int find(int x) {
        while (parent[x] != x) x = parent[x];  // iterativo — NO recursive con path compression
        return x;
    }
    
    bool unite(int x, int y) {
        x = find(x); y = find(y);
        if (x == y) return false;
        if (rank_[x] < rank_[y]) swap(x, y);
        
        // Guardar estado antes de modificar
        history.push_back({&parent[y], parent[y]});
        history.push_back({&sz[x], sz[x]});
        if (rank_[x] == rank_[y])
            history.push_back({&rank_[x], rank_[x]});
        
        parent[y] = x;
        sz[x] += sz[y];
        if (rank_[x] == rank_[y]) rank_[x]++;
        
        return true;
    }
    
    // Guardar "checkpoint" (punto de rollback)
    int save() { return history.size(); }
    
    // Revertir hasta el checkpoint guardado
    void rollback(int checkpoint) {
        while ((int)history.size() > checkpoint) {
            *history.back().first = history.back().second;
            history.pop_back();
        }
    }
    
    bool connected(int x, int y) { return find(x) == find(y); }
};
```

---

## 5. Aplicaciones de DSU

### Contar Islas en una Rejilla

```cpp
// Contar islas (componentes de celdas con valor 1) en rejilla rows×cols
int count_islands(vector<string>& grid) {
    int rows = grid.size(), cols = grid[0].size();
    DSU dsu(rows * cols);
    
    int dx[] = {0, 1};
    int dy[] = {1, 0};
    
    int land_count = 0;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == '1') {
                land_count++;
                int id = r * cols + c;
                for (int d = 0; d < 2; d++) {
                    int nr = r + dx[d], nc = c + dy[d];
                    if (nr < rows && nc < cols && grid[nr][nc] == '1') {
                        if (dsu.unite(id, nr * cols + nc))
                            land_count--;  // dos islas se fusionan en una
                    }
                }
            }
        }
    }
    
    return land_count;
}
```

### Problema de Conectividad Dinámica

```cpp
// Agregar aristas online y responder preguntas de conectividad
int N, Q;
cin >> N >> Q;
DSU dsu(N);

while (Q--) {
    int type, u, v;
    cin >> type >> u >> v;
    u--; v--;
    
    if (type == 1) {
        // Agregar arista (u, v)
        dsu.unite(u, v);
    } else {
        // ¿Están u y v conectados?
        cout << (dsu.connected(u, v) ? "YES" : "NO") << "\n";
    }
}
```

### Detección de Ciclo en Grafo No Dirigido

```cpp
// Si al agregar arista (u,v) ya estaban en el mismo componente → ciclo
DSU dsu(N);
bool has_cycle = false;
for (auto [u, v] : edges) {
    if (!dsu.unite(u, v)) {
        has_cycle = true;
        break;
    }
}
```

### Percolación

¿Existe un camino de arriba a abajo en una rejilla aleatoria? Agregar celdas una a una y verificar si "top" y "bottom" están conectados usando DSU.

---

## 6. DSU vs BFS/DFS — Cuándo Usar Cada Uno

| Escenario | DSU | BFS/DFS |
|-----------|-----|---------|
| Agregar aristas online, consultar conectividad | ✓ Mejor | Requiere reconstruir |
| Análisis estático de componentes | Equivalente | Equivalente |
| Detectar ciclos al construir grafo | ✓ Mejor | Posible pero más lento |
| Necesitas el camino entre dos nodos | No | ✓ BFS/DFS |
| Necesitas distancias | No | ✓ BFS/DFS |
| Rollback (deshacer operaciones) | Con rollback-DSU | No directamente |
| Componentes en grafo dirigido (SCC) | No | ✓ DFS (Tarjan/Kosaraju) |

---

## 7. Trampas Comunes

### Trampa 1: Olvidar path compression o union by rank

```cpp
// Sin path compression: find es O(N) en peor caso → TLE para N grande
int find_sin_compression(int x) {
    while (parent[x] != x) x = parent[x];  // recorre toda la cadena cada vez
    return x;
}

// Con path compression: O(α(N)) amortizado
int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);
    return parent[x];
}
```

### Trampa 2: Llamar `find` y Luego Modificar parent sin Usar la Raíz

```cpp
// MAL: usar x antes del find
parent[x] = y;  // x puede no ser raíz!

// BIEN: siempre trabajar con las raíces
int rx = find(x), ry = find(y);
parent[ry] = rx;
```

### Trampa 3: No Actualizar sz al Unir

```cpp
// MAL: no actualizar sz
parent[y] = x;  // sz[x] sigue siendo el tamaño viejo de x

// BIEN:
parent[y] = x;
sz[x] += sz[y];  // el componente de x ahora incluye el de y
```

### Trampa 4: Usar DSU para Grafos Dirigidos

```
DSU solo funciona correctamente para grafos NO DIRIGIDOS.
Para componentes en grafos dirigidos → usar SCC (Tarjan/Kosaraju).
```

---

## 8. Checklist Pre-Submit

```
[ ] ¿Inicialicé parent[i] = i y rank_[i] = 0 para todo i?
[ ] ¿La función find usa path compression?
[ ] ¿La función unite usa union by rank?
[ ] ¿Actualizo sz al hacer unite?
[ ] ¿Decremento components en unite?
[ ] ¿El grafo es no dirigido? (DSU no aplica a dirigido)
[ ] ¿La indexación es correcta? (0-based vs 1-based)
[ ] ¿Si el grafo tiene componentes desconectadas, lo manejo correctamente?
```

---

## 🔗 Relacionado

- [[07_MST]]
- [[02_BFS]]
- [[03_DFS]]
- [[09_SCC]]
- [[19_OPTIMIZACIONES]]

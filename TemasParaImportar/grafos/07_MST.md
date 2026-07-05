---
titulo: "MST — Árbol de Expansión Mínima"
tipo: icpc-tema
categoria: grafos
estado: en-progreso
etiquetas: [icpc, icpc/tema, icpc/categoria/grafos]
fuente-cph: "Cap. 15"
fuente-cp4: "§4.3"
creado: 2026-04-17
actualizado: 2026-04-17
---

# MST — Árbol de Expansión Mínima

> CPH Cap. 15 | CP4 §4.3 | CPA: minimum-spanning-tree

El Árbol de Expansión Mínima (MST) conecta todos los $N$ nodos de un grafo con $N-1$ aristas y **mínima suma de pesos**. Tiene aplicaciones en redes de comunicación, clustering y diseño de infraestructura.

---

## 1. Concepto

**Definición:** Dado un grafo conexo no dirigido ponderado $G = (V, E)$, el MST es un subconjunto de aristas $T \subseteq E$ tal que:
1. $T$ forma un árbol (conexo, sin ciclos, $N-1$ aristas)
2. La suma de pesos $\sum_{e \in T} w(e)$ es mínima

**Propiedades:**
- El MST siempre existe si el grafo es conexo.
- Si todos los pesos son distintos, el MST es único.
- El MST puede tener pesos negativos (el algoritmo funciona igual).
- Hay múltiples MSTs posibles si hay aristas con el mismo peso.

---

## 2. La Propiedad de Corte (Cut Property)

Esta propiedad justifica por qué los algoritmos voraces funcionan:

> **Propiedad de corte:** Sea $(S, V \setminus S)$ cualquier corte del grafo. La arista de menor peso que cruza el corte pertenece a **algún** MST.

**Intuición:** Si existe un MST que no incluye esa arista, podemos intercambiarla por otra arista del corte en el MST y obtener un árbol de igual o menor costo. ∴ La arista de mínimo peso del corte siempre es segura incluir.

---

## 3. Kruskal — Con Union-Find

Kruskal agrega aristas en orden ascendente de peso, incluyendo una arista solo si no crea un ciclo.

```
Algoritmo:
1. Ordenar todas las aristas por peso (ascendente)
2. Inicializar DSU: cada nodo en su propio componente
3. Para cada arista (u, v, w) en orden:
   Si find(u) ≠ find(v): incluir arista, unite(u, v)
4. Repetir hasta agregar N-1 aristas
```

```cpp
// Kruskal — O(M log M) (dominado por el sort)
// CPH Cap. 15 | CP4 §4.3

#include <bits/stdc++.h>
using namespace std;

// ========== UNION-FIND (DSU) ==========
struct DSU {
    vector<int> parent, rank_;
    int components;
    
    DSU(int n) : parent(n), rank_(n, 0), components(n) {
        iota(parent.begin(), parent.end(), 0);  // parent[i] = i
    }
    
    // Path compression: apuntar directamente a la raíz
    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);  // path compression recursiva
        return parent[x];
    }
    
    // Union by rank: el árbol más bajo bajo el más alto
    bool unite(int x, int y) {
        x = find(x); y = find(y);
        if (x == y) return false;  // ya en el mismo componente → ciclo
        
        if (rank_[x] < rank_[y]) swap(x, y);
        parent[y] = x;             // y → x
        if (rank_[x] == rank_[y]) rank_[x]++;  // aumentar rango si igual
        
        components--;
        return true;
    }
    
    bool connected(int x, int y) { return find(x) == find(y); }
};

// ========== KRUSKAL ==========
// edges: vector de {peso, u, v} — IMPORTANTE: peso primero para sort natural
// Retorna el costo total del MST, o -1 si el grafo no es conexo
long long kruskal(int N, vector<tuple<int,int,int>>& edges) {
    // Ordenar por peso (el primer elemento del tuple)
    sort(edges.begin(), edges.end());
    
    DSU dsu(N);
    long long mst_cost = 0;
    int edges_added = 0;
    
    // Para cada arista en orden ascendente de peso
    for (auto [w, u, v] : edges) {
        // Si u y v están en componentes distintas → agregar al MST
        if (dsu.unite(u, v)) {
            mst_cost += w;
            edges_added++;
            
            // El MST tiene exactamente N-1 aristas
            if (edges_added == N - 1) break;
        }
        // Si find(u) == find(v) → crear un ciclo → NO incluir
    }
    
    // Si no agregamos N-1 aristas → grafo desconectado, no existe MST
    if (edges_added < N - 1) return -1;
    
    return mst_cost;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int N, M;
    cin >> N >> M;
    
    vector<tuple<int,int,int>> edges;  // {peso, u, v}
    for (int i = 0; i < M; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        u--; v--;
        edges.push_back({w, u, v});  // peso PRIMERO para sort correcto
    }
    
    long long result = kruskal(N, edges);
    if (result == -1) cout << "IMPOSSIBLE\n";
    else cout << result << "\n";
    
    return 0;
}
```

### Variante: Guardar las Aristas del MST

```cpp
// Kruskal que también guarda qué aristas forman el MST
pair<long long, vector<pair<int,int>>> kruskal_with_edges(int N, vector<tuple<int,int,int>>& edges) {
    sort(edges.begin(), edges.end());
    DSU dsu(N);
    long long mst_cost = 0;
    vector<pair<int,int>> mst_edges;
    
    for (auto [w, u, v] : edges) {
        if (dsu.unite(u, v)) {
            mst_cost += w;
            mst_edges.push_back({u, v});  // guardar arista
            if ((int)mst_edges.size() == N-1) break;
        }
    }
    
    return {mst_cost, mst_edges};
}
```

---

## 4. Prim — Con Min-Heap

Prim crece el MST desde un nodo inicial, agregando siempre la arista más barata que conecta el árbol con un nodo fuera de él.

```
Algoritmo:
1. Empezar con el nodo 0 en el MST
2. Usar min-heap de {costo, nodo_fuera_del_MST}
3. Mientras haya nodos fuera del MST:
   a. Extraer (costo_min, v) del heap
   b. Si v ya está en el MST, ignorar
   c. Agregar v al MST, sumar costo_min
   d. Para cada vecino w de v que no está en el MST:
      Encolar {peso(v,w), w}
```

```cpp
// Prim con min-heap — O((N+M) log N)
// CPH Cap. 15 | CP4 §4.3
// Similar a Dijkstra en estructura

long long prim(int N, vector<vector<pair<int,int>>>& adj) {
    vector<bool> in_mst(N, false);    // ¿ya está en el MST?
    vector<long long> key(N, 1e18);   // mínima arista que conecta a nodo con el MST
    
    // Min-heap: {costo_de_arista, nodo}
    priority_queue<pair<long long,int>,
                   vector<pair<long long,int>>,
                   greater<>> pq;
    
    key[0] = 0;     // comenzar desde nodo 0 con costo 0
    pq.push({0, 0});
    
    long long mst_cost = 0;
    int nodes_added = 0;
    
    while (!pq.empty() && nodes_added < N) {
        auto [d, u] = pq.top(); pq.pop();
        
        if (in_mst[u]) continue;  // ya procesado (lazy deletion)
        
        in_mst[u] = true;
        mst_cost += d;     // agregar el costo de la arista que trajo u al MST
        nodes_added++;
        
        // Explorar vecinos de u no en el MST
        for (auto [v, w] : adj[u]) {
            if (!in_mst[v] && w < key[v]) {
                key[v] = w;
                pq.push({(long long)w, v});
            }
        }
    }
    
    // Si nodes_added < N → grafo desconectado
    return nodes_added == N ? mst_cost : -1;
}
```

---

## 5. Kruskal vs Prim

| Aspecto | Kruskal | Prim |
|---------|---------|------|
| Estructura | Edge list ordenada + DSU | Lista adj + heap |
| Complejidad | $O(M \log M)$ | $O(M \log N)$ |
| Mejor para | Grafos dispersos (sparse) | Grafos densos |
| Implementación | Más simple | Similar a Dijkstra |
| Paralelizable | Más fácil | Menos fácil |
| Si el grafo es árbol | $O(N \log N)$ | $O(N \log N)$ |

**Regla práctica ICPC:** Kruskal es más fácil de implementar y funciona bien para grafos dispersos. Para grafos densos, Prim naive $O(N^2)$ puede ser mejor.

---

## 6. Maximum Spanning Tree

Para encontrar el árbol de **máxima** suma de pesos: invertir los signos de todos los pesos y aplicar Kruskal (o simplemente ordenar en orden descendente).

```cpp
// Opción 1: Negar todos los pesos
for (auto& [w, u, v] : edges) w = -w;
long long max_mst = -kruskal(N, edges);

// Opción 2: Ordenar en orden descendente
sort(edges.begin(), edges.end(), greater<>());
// Luego aplicar Kruskal normalmente
```

---

## 7. Minimum Spanning Forest

Si el grafo no es conexo, el MST no existe, pero podemos encontrar el **Minimum Spanning Forest** (MST de cada componente):

```cpp
// MSF: MST de cada componente
// Kruskal funciona igual — simplemente no requiere N-1 aristas en total
long long msf(int N, vector<tuple<int,int,int>>& edges) {
    sort(edges.begin(), edges.end());
    DSU dsu(N);
    long long total_cost = 0;
    
    for (auto [w, u, v] : edges) {
        if (dsu.unite(u, v)) {
            total_cost += w;
        }
    }
    
    return total_cost;  // No verificar si edges_added == N-1
}
```

---

## 8. Aplicaciones en ICPC

### Conexión de Ciudades con Mínimo Costo

Directamente MST.

### Clustering

Eliminar las $k-1$ aristas más pesadas del MST → $k$ clusters.

### Minimax Path (Cuello de Botella Mínimo)

"¿Cuál es la mínima capacidad máxima de arista en algún camino de $u$ a $v$?"

En el MST, el camino entre cualquier par $(u, v)$ tiene la **mínima arista máxima** (minimax). Esto es una propiedad del MST.

```cpp
// Para cada par (u,v): la arista máxima en el camino del MST
// es la mínima posible sobre todos los caminos en el grafo original.
// → Construir MST, luego hacer LCA + binary lifting para consultas.
```

### Borůvka

Algoritmo de MST alternativo, útil en algunos problemas paralelos. Aquí no se detalla.

---

## 9. Trampas Comunes

### Trampa 1: Olvidar el Orden del Tuple (peso primero)

```cpp
// MAL: {u, v, w} → sort ordena por u primero, no por peso
edges.push_back({u, v, w});
sort(edges.begin(), edges.end());

// BIEN: {w, u, v} → sort ordena por peso (primer elemento)
edges.push_back({w, u, v});
sort(edges.begin(), edges.end());

// Alternativa: sort con comparador explícito
sort(edges.begin(), edges.end(), [](auto& a, auto& b) {
    return get<0>(a) < get<0>(b);
});
```

### Trampa 2: Grafo Desconectado

```cpp
// Verificar si el MST es completo
if (edges_added < N - 1) {
    cout << "IMPOSSIBLE\n";
    return;
}
```

### Trampa 3: Pesos Negativos en Prim

```cpp
// Prim funciona con pesos negativos, pero key[] debe iniciarse con +∞
// Si initias key[] con 0, los pesos negativos no se detectan correctamente
vector<long long> key(N, 1e18);  // ← usar +∞, no 0
```

### Trampa 4: Aristas No Dirigidas — Agregar Una Sola Vez en Edge List

```cpp
// Para Kruskal con edge list:
// Cada arista no dirigida se agrega UNA SOLA VEZ al edge list
// (no en ambas direcciones como en la lista de adyacencia)
edges.push_back({w, u, v});
// NO: edges.push_back({w, v, u}); ← duplicaría la arista
```

---

## 10. Checklist Pre-Submit

```
[ ] ¿El grafo es conexo? (Si no, verificar si piden MST o MSF)
[ ] ¿El tuple es {peso, u, v} para Kruskal? (peso primero)
[ ] ¿El sort es por peso (primer elemento)?
[ ] ¿El DSU está correctamente inicializado (path compression + union by rank)?
[ ] ¿Verifico que se agregaron N-1 aristas al final?
[ ] ¿Uso long long para mst_cost? (pesos * N puede ser grande)
[ ] ¿Para Prim: in_mst[], key[] correctamente inicializados?
[ ] ¿Si necesito Maximum Spanning Tree: invertí los pesos o el orden?
[ ] ¿Hay aristas con pesos iguales? (puede haber múltiples MSTs válidos)
```

---

## 🔗 Relacionado

- [[08_COMPONENTES]]
- [[04_DIJKSTRA]]
- [[icpc/temas/GRAPHS_ICPC/01_RECETA_UNIVERSAL]]
- [[14_ARBOLES_ESPECIALES]]
- [[17_ERRORES_CONCEPTUALES]]

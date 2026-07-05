---
titulo: "Estructuras Especiales en Árboles — LCA, HLD, Centroid"
tipo: icpc-tema
categoria: grafos
estado: en-progreso
etiquetas: [icpc, icpc/tema, icpc/categoria/grafos]
fuente-cph: "Cap. 18"
fuente-cp4: "§4.8"
creado: 2026-04-17
actualizado: 2026-04-17
---

# Estructuras Especiales en Árboles

> CPH Cap. 18 | CP4 §4.8 | CPA: lca, hld, centroid-decomposition

Las estructuras avanzadas en árboles permiten responder eficientemente consultas de distancias, ancestros y rangos en subárboles.

---

## 1. LCA — Ancestro Común Más Bajo

**Definición:** El LCA (Lowest Common Ancestor) de dos nodos $u$ y $v$ en un árbol con raíz es el nodo más profundo que es ancestro de ambos.

```
Árbol con raíz en 1:
        1
       / \
      2   3
     / \   \
    4   5   6
         \
          7

LCA(4, 7) = 2   (el primer ancestro común de 4 y 7 es 2)
LCA(4, 6) = 1   (el primer ancestro común es la raíz 1)
LCA(5, 7) = 5   (7 es descendiente de 5 → LCA = 5)
```

**Propiedad útil:** La distancia entre $u$ y $v$ en el árbol es:
$$\text{dist}(u, v) = \text{depth}[u] + \text{depth}[v] - 2 \cdot \text{depth}[\text{LCA}(u, v)]$$

---

## 2. LCA con Binary Lifting

**Idea:** Precalcular `ancestor[k][v]` = el $2^k$-ésimo ancestro de $v$. Para encontrar el LCA, "saltar" en potencias de 2.

```cpp
// LCA con Binary Lifting
// O(N log N) preprocesamiento, O(log N) por consulta
// CPH Cap. 18 | CP4 §4.8 | CPA: lca-binary-lifting

#include <bits/stdc++.h>
using namespace std;

const int MAXN = 100005;
const int LOG = 17;  // 2^17 > 10^5

int N;
vector<int> adj[MAXN];   // árbol como lista de adyacencia
int depth[MAXN];         // profundidad de cada nodo (raíz = 0)
int parent[LOG][MAXN];   // parent[k][v] = 2^k-ésimo ancestro de v

// Paso 1: DFS para calcular depth y parent[0][]
void dfs(int v, int p, int d) {
    depth[v] = d;
    parent[0][v] = p;  // padre directo
    for (int u : adj[v]) {
        if (u != p) dfs(u, v, d+1);
    }
}

// Paso 2: Calcular todos los ancestros con Binary Lifting
void build_lca(int root) {
    dfs(root, root, 0);  // parent[0][root] = root (la raíz es su propio "padre")
    
    for (int k = 1; k < LOG; k++) {
        for (int v = 1; v <= N; v++) {
            // El 2^k-ésimo ancestro es el 2^(k-1)-ésimo ancestro del 2^(k-1)-ésimo ancestro
            parent[k][v] = parent[k-1][parent[k-1][v]];
        }
    }
}

// Paso 3: Consulta LCA(u, v) — O(log N)
int lca(int u, int v) {
    // Asegurar que u esté más profundo que v
    if (depth[u] < depth[v]) swap(u, v);
    
    // Nivelar u con v: subir u por (depth[u] - depth[v]) pasos
    int diff = depth[u] - depth[v];
    for (int k = 0; k < LOG; k++) {
        if ((diff >> k) & 1) {  // si el k-ésimo bit de diff está activo
            u = parent[k][u];   // subir 2^k pasos
        }
    }
    
    // Si son el mismo nodo, uno es ancestro del otro
    if (u == v) return u;
    
    // Subir ambos hasta que sus ancestros sean el mismo
    for (int k = LOG-1; k >= 0; k--) {
        if (parent[k][u] != parent[k][v]) {
            u = parent[k][u];
            v = parent[k][v];
        }
    }
    
    // El LCA es el padre inmediato actual
    return parent[0][u];
}

// Distancia entre u y v en el árbol
int tree_distance(int u, int v) {
    int l = lca(u, v);
    return depth[u] + depth[v] - 2 * depth[l];
}
```

---

## 3. Euler Tour para LCA (Alternativo)

```cpp
// LCA via Euler Tour + Sparse Table (RMQ)
// O(N log N) preprocesamiento, O(1) por consulta
// Más eficiente para muchas consultas

vector<int> euler;       // secuencia del Euler tour
vector<int> first;       // primera aparición de cada nodo en euler
vector<int> euler_depth; // profundidad en cada posición del euler tour

void euler_dfs(int v, int p) {
    first[v] = euler.size();
    euler.push_back(v);
    euler_depth.push_back(depth[v]);
    
    for (int u : adj[v]) {
        if (u != p) {
            euler_dfs(u, v);
            euler.push_back(v);       // regresar al padre
            euler_depth.push_back(depth[v]);
        }
    }
}

// Luego aplicar Sparse Table sobre euler_depth para RMQ
// LCA(u,v) = euler[posición de min en euler_depth[first[u]..first[v]]]
```

---

## 4. Heavy-Light Decomposition (HLD)

HLD descompone el árbol en cadenas (caminos) de manera que cada camino de raíz a hoja pasa por a lo sumo $O(\log N)$ cadenas. Permite aplicar Segment Trees sobre paths del árbol.

**Definición:** El hijo "pesado" de $v$ es el hijo con el subárbol más grande. La HLD conecta cada nodo con su hijo pesado formando "cadenas pesadas".

```cpp
// Heavy-Light Decomposition
// O(N log N) construcción, O(log² N) por consulta (log N por HLD + log N por Seg. Tree)
// CPH Cap. 18 | CPA: hld

const int MAXN = 100005;

int N;
vector<int> adj[MAXN];

int parent_hld[MAXN];  // padre en el árbol
int depth_hld[MAXN];   // profundidad
int sz[MAXN];          // tamaño del subárbol
int heavy[MAXN];       // hijo pesado (-1 si es hoja)
int head[MAXN];        // cabeza de la cadena pesada del nodo
int pos[MAXN];         // posición en el array del Segment Tree
int pos_end[MAXN];     // posición final del subárbol (para queries de subárbol)
int cur_pos = 0;

// DFS para calcular sz y heavy
void dfs_hld(int v, int p, int d) {
    parent_hld[v] = p;
    depth_hld[v] = d;
    sz[v] = 1;
    heavy[v] = -1;
    int max_sz = 0;
    
    for (int u : adj[v]) {
        if (u == p) continue;
        dfs_hld(u, v, d+1);
        sz[v] += sz[u];
        if (sz[u] > max_sz) {
            max_sz = sz[u];
            heavy[v] = u;  // u es el hijo más pesado
        }
    }
}

// DFS para asignar posiciones y cabezas de cadena
void decompose(int v, int h) {
    head[v] = h;          // v pertenece a la cadena con cabeza h
    pos[v] = cur_pos++;   // asignar posición en el Seg. Tree
    
    if (heavy[v] != -1) {
        decompose(heavy[v], h);  // continuar la cadena pesada
    }
    
    for (int u : adj[v]) {
        if (u == parent_hld[v] || u == heavy[v]) continue;
        decompose(u, u);  // nueva cadena desde u (u es su propia cabeza)
    }
    
    pos_end[v] = cur_pos;  // fin del subárbol de v
}

// Query en el camino de u a v usando Segment Tree (esquemático)
long long query_path(int u, int v, /* Seg. Tree */ ...) {
    long long result = 0;
    
    while (head[u] != head[v]) {
        if (depth_hld[head[u]] < depth_hld[head[v]]) swap(u, v);
        // u y v están en cadenas distintas; subir la cadena de u (la más profunda)
        result += seg_query(pos[head[u]], pos[u]);  // query [head[u], u]
        u = parent_hld[head[u]];  // saltar al padre de la cabeza
    }
    
    // Ahora u y v están en la misma cadena
    if (depth_hld[u] > depth_hld[v]) swap(u, v);
    result += seg_query(pos[u], pos[v]);  // query [u, v] en la cadena
    
    return result;
}
```

**Aplicaciones de HLD:**
- Suma/mínimo/máximo en el camino entre dos nodos
- Actualización de pesos en aristas del camino
- Cualquier operación de rango en un camino del árbol

---

## 5. Centroid Decomposition

**Centroide:** Un nodo tal que todos los subárboles resultantes de su eliminación tienen tamaño $\leq N/2$.

**Propiedad:** Todo árbol tiene al menos un centroide, y puede tener a lo sumo 2.

**Centroid Decomposition:** Construir recursivamente el "árbol de centroides" dividiendo el árbol por el centroide en cada nivel.

```cpp
// Centroid Decomposition
// O(N log N) construcción
// CPH Cap. 18 | CPA: centroid-decomposition

int N;
vector<int> adj[MAXN];
int sz_cd[MAXN];        // tamaño del subárbol
bool removed[MAXN];     // ¿fue este nodo ya eliminado como centroide?
int centroid_parent[MAXN];  // padre en el árbol de centroides

// Calcular tamaños de subárbol
void calc_sz(int v, int p) {
    sz_cd[v] = 1;
    for (int u : adj[v]) {
        if (u == p || removed[u]) continue;
        calc_sz(u, v);
        sz_cd[v] += sz_cd[u];
    }
}

// Encontrar el centroide del componente con raíz v, tamaño total comp_sz
int find_centroid(int v, int p, int comp_sz) {
    for (int u : adj[v]) {
        if (u == p || removed[u]) continue;
        // Si el subárbol de u tiene más de la mitad de los nodos
        if (sz_cd[u] > comp_sz / 2) {
            return find_centroid(u, v, comp_sz);
        }
    }
    return v;  // v es el centroide
}

// Construir el árbol de centroides recursivamente
void build_centroid(int v, int par) {
    calc_sz(v, -1);
    int c = find_centroid(v, -1, sz_cd[v]);
    
    centroid_parent[c] = par;
    removed[c] = true;  // marcar c como "eliminado" del árbol original
    
    for (int u : adj[c]) {
        if (!removed[u]) {
            build_centroid(u, c);  // construir recursivamente para cada componente
        }
    }
}

// Aplicación: contar pares de nodos a distancia <= K
// Para cada centroide c, contar pares donde ambos nodos pasan por c
// Complejidad: O(N log² N) típico

void solve_centroid(int v, int par_centroid) {
    // Recopilar distancias desde el centroide v
    // Para cada nodo en el componente, la distancia al centroide
    // Usar técnica de inclusión-exclusión para evitar contar pares dentro del mismo subárbol
    
    // ... (implementación específica del problema)
    
    removed[v] = true;
    for (int u : adj[v]) {
        if (!removed[u]) {
            solve_centroid(find_centroid(u, -1, sz_cd[u]), v);
        }
    }
}
```

**Aplicaciones de Centroid Decomposition:**
- Contar pares de nodos a distancia exactamente $K$
- Problemas de caminos más cortos en árboles con consultas
- Problemas donde necesitas sumar sobre todos los caminos que pasan por un nodo

---

## 6. Comparación de Técnicas

| Técnica | Preprocesamiento | Por consulta | Aplicación |
|---------|-----------------|-------------|-----------|
| LCA Naive | $O(N)$ | $O(N)$ | Solo para N pequeño |
| LCA Binary Lifting | $O(N \log N)$ | $O(\log N)$ | Distancias, kth ancestor |
| LCA Euler+RMQ | $O(N \log N)$ | $O(1)$ | Muchas consultas LCA |
| HLD + Seg. Tree | $O(N \log N)$ | $O(\log^2 N)$ | Queries en caminos |
| Centroid Decomp. | $O(N \log N)$ | $O(\log^2 N)$ | Problemas de distancias |

---

## 7. Trampas Comunes

### Trampa 1: LOG Insuficiente

```cpp
const int LOG = 17;  // ← suficiente para N ≤ 10^5 (2^17 = 131072 > 10^5)
// Para N ≤ 10^6: usar LOG = 20 (2^20 > 10^6)
// Para N ≤ 10^9: usar LOG = 30
```

### Trampa 2: La Raíz es su Propio Padre

```cpp
// La raíz no tiene padre real → definir parent[0][root] = root
dfs(root, root, 0);  // ← root como "padre" de la raíz

// Esto garantiza que subir más allá de la raíz se queda en la raíz
// (necesario para el binary lifting cuando depth[u] > depth[v])
```

### Trampa 3: HLD — Orden de Visita de Hijos

```cpp
// En HLD: visitar PRIMERO el hijo pesado para que su posición
// sea contigua con la del padre en el Segment Tree
if (heavy[v] != -1) {
    decompose(heavy[v], h);  // ← PRIMERO el hijo pesado
}
// LUEGO los hijos ligeros (en cualquier orden)
for (int u : adj[v]) { ... }
```

### Trampa 4: Centroid ya Marcado como Removed

```cpp
// En find_centroid: ignorar nodos removed
for (int u : adj[v]) {
    if (u == p || removed[u]) continue;  // ← crítico
    ...
}
```

---

## 8. Checklist Pre-Submit

```
[ ] ¿LOG es suficientemente grande para N?
[ ] ¿La raíz tiene parent[0][root] = root?
[ ] ¿Ejecuto DFS antes de build_lca para inicializar depth y parent[0]?
[ ] Para LCA: ¿Primero niveleo profundidades, luego busco el LCA?
[ ] Para HLD: ¿El hijo pesado se visita primero en decompose?
[ ] Para Centroid: ¿Marco removed[c] = true antes de recursión?
[ ] ¿calc_sz se llama con el nodo padre correcto (-1 para la raíz)?
```

---

## 🔗 Relacionado

- [[03_DFS]]
- [[icpc/temas/GRAPHS_ICPC/00_INTRODUCCION]]
- [[19_OPTIMIZACIONES]]
- [[17_ERRORES_CONCEPTUALES]]

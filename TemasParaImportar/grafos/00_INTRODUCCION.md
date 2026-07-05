---
titulo: "Introducción a Grafos para ICPC"
tipo: icpc-tema
categoria: grafos
estado: en-progreso
etiquetas: [icpc, icpc/tema, icpc/categoria/grafos]
fuente-cph: "Cap. 11"
fuente-cp4: "§4.1"
creado: 2026-04-17
actualizado: 2026-04-17
---

# Introducción a Grafos para ICPC

> CPH Cap. 11 | CP4 §4.1

Un grafo es una de las estructuras más versátiles en algoritmia competitiva. Casi cualquier problema que involucre relaciones entre entidades puede modelarse como un grafo.

---

## 1. Definición Formal

Un grafo $G = (V, E)$ consiste en:
- $V$ = conjunto de **vértices** (o nodos). $|V| = N$.
- $E$ = conjunto de **aristas** (o edges). $|E| = M$.

Cada arista $e \in E$ conecta un par de vértices $(u, v)$.

### Terminología fundamental

| Término | Inglés | Definición |
|---------|--------|------------|
| Vértice | Vertex / Node | Entidad del grafo. Se denota $v$, $u$, $i$. |
| Arista | Edge | Conexión entre dos vértices. Se denota $(u, v)$ o $\{u, v\}$. |
| Peso | Weight | Valor numérico asignado a una arista. |
| Grado | Degree | Número de aristas incidentes a un vértice. |
| Grado de entrada | In-degree | En dirigido: aristas que llegan al vértice. |
| Grado de salida | Out-degree | En dirigido: aristas que salen del vértice. |
| Camino | Path | Secuencia de vértices conectados por aristas. |
| Camino simple | Simple path | Camino sin vértices repetidos. |
| Ciclo | Cycle | Camino que empieza y termina en el mismo vértice. |
| Longitud | Length | Número de aristas en un camino (sin pesos). |
| Distancia | Distance | Mínima longitud entre dos vértices. |
| Vecino | Neighbor | Vértice adyacente (conectado por arista). |
| Subgrafo | Subgraph | Grafo formado por subconjunto de $V$ y $E$. |
| Grafo conexo | Connected graph | Existe camino entre todo par de vértices. |
| Componente | Component | Subgrafo conexo maximal. |

---

## 2. Tipos de Grafos

### 2.1 Dirigido vs No Dirigido

**No dirigido** (undirected):
- Las aristas no tienen dirección: $(u, v) = (v, u)$.
- Representa relaciones simétricas: amistades, carreteras bidireccionales.
- Al codificar: añadir arista en **ambas** direcciones.

```
No dirigido:
    1 --- 2 --- 3
    |         /
    4 --------
```

**Dirigido** (directed / digraph):
- Las aristas tienen dirección: $(u, v) \neq (v, u)$.
- Representa relaciones asimétricas: seguir en Twitter, autopistas de un sentido.
- Al codificar: añadir arista solo en **una** dirección.

```
Dirigido:
    1 --> 2 --> 3
    |         /
    v        /
    4 <------
```

**¿Cómo reconocerlo en el enunciado?**
- "bidireccional", "carretera de dos vías" → no dirigido
- "de A a B", "puedes ir de X a Y pero no de Y a X" → dirigido
- "flujo", "dependencias", "prerrequisitos" → dirigido

---

### 2.2 Ponderado vs No Ponderado

**No ponderado** (unweighted):
- Todas las aristas tienen peso implícito 1.
- Preguntas: ¿mínimos pasos? ¿están conectados?
- Algoritmo: BFS.

**Ponderado** (weighted):
- Cada arista tiene un peso $w(u, v) \in \mathbb{R}$.
- Preguntas: ¿mínima distancia/costo?
- Algoritmos: Dijkstra, Bellman-Ford, Floyd-Warshall.

**¿Cómo reconocerlo?**
- "distancia entre ciudades", "costo de vuelo", "tiempo de viaje" → ponderado
- "mínimos pasos", "¿puedes llegar?" → no ponderado

---

### 2.3 Denso vs Disperso (Sparse)

**Denso** (dense): $M \approx N^2$. El grafo tiene casi todas las aristas posibles.
- Representación preferida: **matriz de adyacencia**.
- Aparece en: grafos completos, Floyd-Warshall.

**Disperso** (sparse): $M \approx N$ o $M \approx N \log N$.
- Representación preferida: **lista de adyacencia**.
- Aparece en: árboles, rejillas, la mayoría de problemas ICPC.

La frontera es ambigua, pero una regla práctica:
- Si $M > N \cdot \log N$ → considera denso
- Si $M \leq 10 \cdot N$ → sparse

---

### 2.4 DAG (Grafo Acíclico Dirigido)

Un **DAG** (Directed Acyclic Graph) es un grafo dirigido sin ciclos dirigidos.

Propiedades clave:
- Siempre existe un **orden topológico**.
- El DP en DAG es posible (procesar en orden topológico).
- Aparece en: dependencias de compilación, prerrequisitos, problemas de scheduling.

```
DAG válido:          No es DAG (tiene ciclo):
1 --> 2 --> 4        1 --> 2 --> 3
|         ^               ^     |
v        /                |     v
3 -------                 4 <---
```

**¿Cómo detectar DAG?** Ejecutar DFS. Si hay back edge → no es DAG.

---

### 2.5 Bipartito

Un grafo es **bipartito** si sus vértices se pueden dividir en dos conjuntos $L$ y $R$ tal que todas las aristas van entre $L$ y $R$ (ninguna arista dentro del mismo conjunto).

```
Bipartito:
L = {1, 3, 5}    R = {2, 4}
    1 --- 2
    1 --- 4
    3 --- 2
    5 --- 4
```

**Propiedades:**
- Un grafo es bipartito $\Leftrightarrow$ no tiene ciclos de longitud impar.
- Detección: 2-coloring con BFS.
- Aparece en: matching, scheduling, problemas de asignación.

---

### 2.6 Árbol

Un **árbol** es un grafo que satisface las tres condiciones equivalentes:
1. Conexo con $N$ vértices y $N-1$ aristas.
2. Conexo sin ciclos.
3. Existe exactamente un camino entre todo par de vértices.

```
Árbol con raíz en 1:
        1
       / \
      2   3
     / \   \
    4   5   6
```

**Propiedades en concursos:**
- Eliminar cualquier arista → grafo desconectado.
- Agregar cualquier arista → crea exactamente un ciclo.
- DFS en árbol = DFS sin back edges.
- Profundidad, LCA, HLD son aplicables.

---

### 2.7 Grafo Completo

Un **grafo completo** $K_n$ tiene una arista entre todo par de vértices.
- $M = \binom{N}{2} = \frac{N(N-1)}{2}$ aristas.
- Para $N = 1000$: $M \approx 500{,}000$.

Aparece en: problemas de coloración, cliques, TSP.

---

## 3. Propiedades Clave

### 3.1 Conectividad

**Grafo conexo**: existe camino entre todo par $(u, v)$.

**Verificar con BFS/DFS desde cualquier nodo:**
```cpp
// Si BFS/DFS desde nodo 0 visita todos los N nodos → conexo
vector<bool> visited(N, false);
bfs(0, adj, visited);
bool connected = all_of(visited.begin(), visited.end(), [](bool b){ return b; });
```

**Componentes conexas**: subgrafos conexos maximales.
- Grafo conexo → 1 componente.
- Para contar: DFS/BFS repetido, o Union-Find.

---

### 3.2 Bipartición

**Verificar**: BFS 2-coloring. Si se puede colorear sin conflictos → bipartito.
- Conflicto: `color[u] == color[v]` para arista $(u, v)$.
- Equivalente: no tiene ciclo impar.

---

### 3.3 Aciclicidad

**En no dirigido**: grafo tiene ciclo $\Leftrightarrow$ DFS encuentra back edge (arista a ancestro).

**En dirigido**: ciclo dirigido $\Leftrightarrow$ DFS encuentra back edge (vértice GRAY en la pila).

**Con Union-Find (no dirigido)**: al agregar arista $(u, v)$, si `find(u) == find(v)` → crea ciclo.

---

## 4. Representaciones

### 4.1 Lista de Adyacencia

```cpp
// No ponderado
vector<vector<int>> adj(N);
adj[u].push_back(v);
// Si no dirigido:
adj[v].push_back(u);

// Ponderado
vector<vector<pair<int,int>>> adj(N); // {vecino, peso}
adj[u].push_back({v, w});
```

- **Espacio**: $O(N + M)$
- **Acceso a vecinos de u**: $O(\text{grado}(u))$
- **Verificar si existe arista (u,v)**: $O(\text{grado}(u))$
- **Mejor para**: grafos dispersos (la mayoría en ICPC)

---

### 4.2 Matriz de Adyacencia

```cpp
// Ponderado (INF si no hay arista)
const int INF = 1e9;
vector<vector<int>> dist(N, vector<int>(N, INF));
for (int i = 0; i < N; i++) dist[i][i] = 0;
dist[u][v] = w;
// Si no dirigido:
dist[v][u] = w;
```

- **Espacio**: $O(N^2)$ — inviable para $N > 10^4$
- **Acceso a arista (u,v)**: $O(1)$
- **Iterar vecinos de u**: $O(N)$
- **Mejor para**: Floyd-Warshall, grafos densos, $N \leq 1000$

---

### 4.3 Edge List (Lista de Aristas)

```cpp
// {peso, u, v} — facilita ordenar por peso
vector<tuple<int,int,int>> edges; // {w, u, v}
edges.push_back({w, u, v});

// O sin peso: {u, v}
vector<pair<int,int>> edges;
edges.push_back({u, v});
```

- **Espacio**: $O(M)$
- **Mejor para**: Kruskal (necesita ordenar aristas), Bellman-Ford
- **No sirve para**: iterar vecinos de un nodo específico

---

## 5. Guía de Decisión

```
¿Cuántos nodos N?
├── N > 10^4 → NO usar matriz de adyacencia
├── N ≤ 500 → Floyd-Warshall viable
└── N ≤ 1000 → Dijkstra por cada nodo viable

¿Necesitas ordenar aristas?
└── Sí → edge list (Kruskal, BF)

¿Necesitas iterar vecinos frecuentemente?
└── Sí → lista de adyacencia

¿Verificar arista (u,v) en O(1)?
└── Sí → matriz de adyacencia
```

---

## 6. Template Base de Lectura de Grafo

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int N, M;
    cin >> N >> M;
    
    // Lista de adyacencia ponderada (indexación 0-based)
    vector<vector<pair<int,int>>> adj(N);
    
    for (int i = 0; i < M; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        u--; v--;  // convertir a 0-based si el problema es 1-based
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});  // eliminar si dirigido
    }
    
    // Tu algoritmo aquí
    
    return 0;
}
```

---

## 7. Tabla de Terminología Bilingüe

| Español | Inglés | Símbolo |
|---------|--------|---------|
| Grafo | Graph | $G = (V, E)$ |
| Vértice / Nodo | Vertex / Node | $v, u, N$ |
| Arista | Edge | $e, M$ |
| Peso | Weight | $w$ |
| Grado | Degree | $\deg(v)$ |
| Grado de entrada | In-degree | $\deg^-(v)$ |
| Grado de salida | Out-degree | $\deg^+(v)$ |
| Camino | Path | — |
| Ciclo | Cycle | — |
| Árbol | Tree | — |
| Árbol con raíz | Rooted tree | — |
| Bosque | Forest | — |
| Grafo conexo | Connected graph | — |
| Componente conexa | Connected component | CC |
| Componente fuertemente conexa | Strongly Connected Component | SCC |
| Grafo bipartito | Bipartite graph | — |
| DAG | DAG | DAG |
| Grafo completo | Complete graph | $K_n$ |
| Puente | Bridge | — |
| Punto de articulación | Articulation point / Cut vertex | — |
| Árbol de expansión | Spanning tree | ST |
| Árbol de expansión mínima | Minimum Spanning Tree | MST |
| Flujo máximo | Maximum flow | — |
| Corte mínimo | Minimum cut | — |

---

## 8. Límites Típicos en ICPC

| Restricción | Qué implica |
|------------|-------------|
| $N, M \leq 10^3$ | Casi cualquier algoritmo $O(N^2)$ funciona |
| $N, M \leq 10^4$ | $O(N^2)$ límite, preferir $O(N \log N)$ |
| $N, M \leq 10^5$ | Solo $O(N \log N)$ o mejor |
| $N, M \leq 10^6$ | Solo $O(N + M)$ o $O(N \log N)$ justo |
| $N \leq 500$ | Floyd-Warshall viable ($N^3 \approx 1.25 \times 10^8$) |
| Tiempo 1s | ~$10^8$ operaciones simples |
| Tiempo 2s | ~$2 \times 10^8$ operaciones simples |

---

## 🔗 Relacionado

- [[icpc/temas/GRAPHS_ICPC/01_RECETA_UNIVERSAL]]
- [[15_REPRESENTACION]]
- [[02_BFS]]
- [[03_DFS]]
- [[icpc/temas/GRAPHS_ICPC/README]]

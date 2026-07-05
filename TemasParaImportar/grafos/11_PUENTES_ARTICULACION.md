---
titulo: "Puentes y Puntos de Articulación (Low-Link)"
tipo: icpc-tema
categoria: grafos
estado: en-progreso
etiquetas: [icpc, icpc/tema, icpc/categoria/grafos]
fuente-cph: "Cap. 14"
fuente-cp4: "§4.7.3"
creado: 2026-04-17
actualizado: 2026-04-17
---

# Puentes y Puntos de Articulación (Low-Link)

> CPH Cap. 14 | CP4 §4.7.3 | CPA: bridges, articulation-points

Los puentes y puntos de articulación son las "partes críticas" de un grafo no dirigido. Eliminar un puente desconecta el grafo; eliminar un punto de articulación también.

---

## 1. Conceptos

**Puente (Bridge):** Arista $(u, v)$ que, al eliminarla, aumenta el número de componentes conexas del grafo.

**Punto de articulación (Cut Vertex):** Nodo que, al eliminarlo (junto con sus aristas), aumenta el número de componentes conexas.

```
Ejemplo:
    1 --- 2 --- 3 --- 4
          |
          5 --- 6

Puentes: (2,3), (3,4), (2,5), (5,6)
   - Eliminar (2,3): {1,2,5,6} y {3,4} se separan
Puntos de articulación: 2, 3, 5
   - Eliminar 2: {1}, {3,4}, {5,6} se separan
   - Eliminar 3: {1,2,5,6} y {4} se separan
   - Eliminar 5: {1,2,3,4} y {6} se separan
```

---

## 2. La Variable `low[v]`

`low[v]` = el menor `tin[u]` alcanzable desde el subárbol de `v` **sin usar la arista que lo conecta a su padre** en el árbol DFS.

Más precisamente: `low[v] = min` de:
1. `tin[v]` (el propio nodo)
2. `tin[u]` para cada back edge $(v, u)$ donde $u$ es ancestro de $v$
3. `low[child]` para cada hijo `child` de $v$ en el árbol DFS

```
Árbol DFS con tin[]:
    0(tin=0) --- 1(tin=1) --- 2(tin=2)
                 |
                 3(tin=3) --- 4(tin=4)
                              |
                              0 (back edge a 0)

low[4] = min(tin[4], tin[0]) = min(4, 0) = 0
low[3] = min(tin[3], low[4]) = min(3, 0) = 0
low[2] = tin[2] = 2 (sin back edges ni hijos con back edges)
low[1] = min(tin[1], low[3]) = min(1, 0) = 0
low[0] = min(tin[0], low[1]) = 0
```

---

## 3. Condición de Puente

**Arista $(u, v)$ es un puente si y solo si:** `low[v] > tin[u]`

Donde $u$ es el padre de $v$ en el árbol DFS.

**Intuición:** Si `low[v] > tin[u]`, entonces ningún nodo en el subárbol de $v$ puede llegar a $u$ o a sus ancestros sin pasar por la arista $(u, v)$. Por lo tanto, eliminar $(u, v)$ desconecta el subárbol de $v$ del resto.

Si `low[v] <= tin[u]`, existe un back edge desde el subárbol de $v$ que sube a $u$ o más arriba → hay un camino alternativo → no es puente.

---

## 4. Implementación de Puentes — Comentada

```cpp
// Encontrar todos los puentes — O(N+M)
// CPH Cap. 14 | CP4 §4.7.3 | CPA: bridges

#include <bits/stdc++.h>
using namespace std;

int N, M;
vector<int> adj[100005];
vector<int> tin, low;
vector<bool> visited;
vector<pair<int,int>> bridges;
int timer_b = 0;

// v: nodo actual, parent: nodo padre en el árbol DFS (-1 para la raíz)
void dfs_bridge(int v, int parent) {
    visited[v] = true;
    tin[v] = low[v] = timer_b++;  // inicializar tin y low
    
    for (int u : adj[v]) {
        if (u == parent) continue;  // no regresar por la misma arista al padre
        
        if (visited[u]) {
            // Back edge: u ya fue visitado y es ancestro de v
            // Actualizar low[v] con el tiempo de entrada de u
            low[v] = min(low[v], tin[u]);
        } else {
            // Tree edge: u no visitado → explorar
            dfs_bridge(u, v);
            
            // Después de explorar u: actualizar low[v] con lo encontrado en u
            low[v] = min(low[v], low[u]);
            
            // CONDICIÓN DE PUENTE:
            // Si low[u] > tin[v], el subárbol de u no tiene camino de regreso
            // a v ni a ningún ancestro de v → la arista (v,u) es un puente
            if (low[u] > tin[v]) {
                bridges.push_back({v, u});
            }
        }
    }
}

void find_bridges() {
    tin.assign(N, -1);
    low.assign(N, 0);
    visited.assign(N, false);
    bridges.clear();
    timer_b = 0;
    
    for (int i = 0; i < N; i++) {
        if (!visited[i]) dfs_bridge(i, -1);
    }
}
```

### ⚠️ Problema con Aristas Múltiples

Si hay múltiples aristas entre $u$ y $v$, no deben cancelarse mutuamente. Usar **índice de arista** en lugar de nodo padre:

```cpp
// Versión robusta con índice de arista (maneja aristas múltiples)
vector<pair<int,int>> adj_idx[100005];  // {vecino, índice_de_arista}

void dfs_bridge_idx(int v, int parent_edge) {
    visited[v] = true;
    tin[v] = low[v] = timer_b++;
    
    for (auto [u, edge_id] : adj_idx[v]) {
        if (edge_id == parent_edge) continue;  // ignorar por índice, no por nodo
        
        if (visited[u]) {
            low[v] = min(low[v], tin[u]);
        } else {
            dfs_bridge_idx(u, edge_id);
            low[v] = min(low[v], low[u]);
            if (low[u] > tin[v]) bridges.push_back({v, u});
        }
    }
}

// Al agregar aristas:
int edge_counter = 0;
void add_edge(int u, int v) {
    adj_idx[u].push_back({v, edge_counter});
    adj_idx[v].push_back({u, edge_counter});  // misma arista, mismo id
    edge_counter++;
}
```

---

## 5. Condición de Punto de Articulación

**Nodo $v$ es un punto de articulación si:**

**Caso 1: $v$ es la RAÍZ del árbol DFS** y tiene **≥ 2 hijos** en el árbol DFS.
- Si tiene 1 hijo: eliminar la raíz no desconecta (el hijo sigue siendo la nueva raíz del componente).
- Si tiene 2+ hijos: no hay back edge entre los subárboles de distintos hijos → se desconectan.

**Caso 2: $v$ NO es la raíz** y tiene **algún hijo $u$ con `low[u] >= tin[v]`**.
- Si `low[u] >= tin[v]`: el subárbol de $u$ no puede llegar más arriba que $v$ → eliminar $v$ desconecta $u$ del resto.
- Si `low[u] < tin[v]`: el subárbol de $u$ tiene back edge que sube por encima de $v$ → hay camino alternativo.

**Diferencia con puentes:** Puentes usan `low[u] > tin[v]` (estricto). Articulaciones usan `low[u] >= tin[v]` (con igualdad).

```cpp
// Encontrar todos los puntos de articulación — O(N+M)
// CPH Cap. 14 | CPA: articulation-points

vector<bool> is_cut;

void dfs_cut(int v, int parent) {
    visited[v] = true;
    tin[v] = low[v] = timer_b++;
    int children = 0;  // número de hijos en el árbol DFS
    
    for (int u : adj[v]) {
        if (u == parent) continue;
        
        if (visited[u]) {
            // Back edge
            low[v] = min(low[v], tin[u]);
        } else {
            children++;
            dfs_cut(u, v);
            low[v] = min(low[v], low[u]);
            
            // CONDICIÓN DE ARTICULACIÓN:
            if (parent == -1 && children > 1) {
                // Caso 1: raíz con 2+ hijos
                is_cut[v] = true;
            }
            if (parent != -1 && low[u] >= tin[v]) {
                // Caso 2: nodo interno con subárbol que no puede subir sobre v
                is_cut[v] = true;
            }
        }
    }
}

void find_articulation_points() {
    tin.assign(N, -1);
    low.assign(N, 0);
    visited.assign(N, false);
    is_cut.assign(N, false);
    timer_b = 0;
    
    for (int i = 0; i < N; i++) {
        if (!visited[i]) dfs_cut(i, -1);
    }
}
```

---

## 6. Diferencia Entre Puentes y Articulaciones

| Aspecto | Puente $(u,v)$ | Articulación $v$ |
|---------|---------------|-----------------|
| Condición | `low[child] > tin[v]` | `low[child] >= tin[v]` (o raíz con 2+ hijos) |
| Estricto o con igualdad | Estricto `>` | Con igualdad `>=` |
| ¿Qué se elimina? | Una arista | Un nodo |
| Resultado de eliminar | Desconecta el grafo | Desconecta el grafo |

**¿Por qué la diferencia?**

Para puentes: si `low[child] == tin[v]`, el hijo puede llegar exactamente a $v$ (no más arriba), pero $v$ sigue estando → el grafo sigue siendo conexo → no es puente.

Para articulaciones: si `low[child] == tin[v]`, el hijo solo puede llegar a $v$ sin usar la arista $(v, child)$. Si eliminamos $v$, el hijo queda desconectado → sí es punto de articulación.

---

## 7. Diagrama ASCII con tin y low

```
Grafo:
    1 --- 2 --- 3
    |           |
    4 --- 5 ----+

DFS desde 1 (suponiendo orden 1,2,3,5,4):
tin: [_, 0, 1, 2, 4, 3]   (índice desde 1)
low: [_, 0, 0, 0, 0, 0]   (hay back edge 4→1 y 5→3)

Arista (1,2):
  low[2] = 0 <= tin[1] = 0 → NO puente (low[2] > tin[1] es falso)

Arista (2,3):
  low[3] = 0 <= tin[2] = 1 → NO puente

¿Por qué low[3] = 0? Porque 5→1 es back edge, y 3→5 es tree edge,
entonces low[3] = min(tin[3], low[5]) = min(2, 0) = 0. ✓
```

---

## 8. Componentes 2-Conexas (Biconnected Components)

Una componente 2-conexa es un subgrafo maximal sin puntos de articulación.

```cpp
// Encontrar todas las componentes 2-conexas usando pila de aristas
stack<pair<int,int>> edge_stack;
vector<vector<pair<int,int>>> bcc;  // biconnected components

void dfs_bcc(int v, int parent) {
    visited[v] = true;
    tin[v] = low[v] = timer_b++;
    
    for (int u : adj[v]) {
        if (u == parent) continue;
        
        if (!visited[u]) {
            edge_stack.push({v, u});  // agregar arista a la pila
            dfs_bcc(u, v);
            low[v] = min(low[v], low[u]);
            
            if (low[u] >= tin[v]) {
                // Encontramos una componente 2-conexa: extraer aristas de la pila
                bcc.push_back({});
                while (edge_stack.top() != make_pair(v, u)) {
                    bcc.back().push_back(edge_stack.top());
                    edge_stack.pop();
                }
                bcc.back().push_back(edge_stack.top());
                edge_stack.pop();
            }
        } else {
            if (tin[u] < tin[v]) {  // back edge, evitar duplicados
                edge_stack.push({v, u});
                low[v] = min(low[v], tin[u]);
            }
        }
    }
}
```

---

## 9. Trampas Comunes

### Trampa 1: Condición `>` vs `>=`

```
Para PUENTES: low[child] > tin[v]    (estricto)
Para ARTICULACIONES: low[child] >= tin[v]  (con igualdad)

Error: usar >= para puentes o > para articulaciones → resultados incorrectos.
```

### Trampa 2: Aristas Múltiples Sin Índice

```
Si hay dos aristas entre u y v:
  adj[u] = {v, v} y adj[v] = {u, u}

Con parent tracking por nodo:
  Al procesar u desde v, ignoras "u == parent" → ignoras UNA arista → MAL
  (la segunda arista no es "la misma" que la que te trajo)

Fix: usar índice de arista para distinguir múltiples aristas.
```

### Trampa 3: Raíz Sin Verificación de Hijos

```cpp
// MAL: misma condición para raíz y nodos internos
if (low[u] >= tin[v]) is_cut[v] = true;

// Para la RAÍZ (parent == -1), necesitas verificar que tiene 2+ hijos
if (parent == -1 && children > 1) is_cut[v] = true;
if (parent != -1 && low[u] >= tin[v]) is_cut[v] = true;
```

### Trampa 4: Stack Overflow

```
DFS recursivo en grafos grandes (N > 10^5) puede causar stack overflow.
Fix: Implementar iterativamente o aumentar el stack size.
```

---

## 10. Checklist Pre-Submit

```
[ ] ¿El grafo es NO DIRIGIDO? (puentes/articulaciones aplican a no dirigido)
[ ] ¿Uso > para puentes y >= para articulaciones?
[ ] ¿Hay aristas múltiples? → usar índice de arista, no nodo padre
[ ] ¿Verifico la condición especial para la raíz del DFS?
[ ] ¿Inicializo timer_b = 0 y tin[] = -1 antes de cada llamada?
[ ] ¿Manejo grafos desconectados? (iterar sobre todos los nodos)
[ ] ¿N > 10^5? → considerar versión iterativa para evitar stack overflow
```

---

## 🔗 Relacionado

- [[03_DFS]]
- [[09_SCC]]
- [[08_COMPONENTES]]
- [[17_ERRORES_CONCEPTUALES]]
- [[18_CASOS_EDGE]]

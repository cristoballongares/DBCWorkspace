---
titulo: "DFS — Búsqueda en Profundidad"
tipo: icpc-tema
categoria: grafos
estado: en-progreso
etiquetas: [icpc, icpc/tema, icpc/categoria/grafos]
fuente-cph: "Cap. 12"
fuente-cp4: "§4.2.1"
creado: 2026-04-17
actualizado: 2026-04-17
---

# DFS — Búsqueda en Profundidad

> CPH Cap. 12 | CP4 §4.2.1 | CPA: dfs

DFS (Depth-First Search) explora el grafo siguiendo un camino hasta el final antes de retroceder. Es la base de muchos algoritmos avanzados: detección de ciclos, orden topológico, SCC, puentes, articulaciones.

---

## 1. Intuición

### La Analogía del Laberinto

Imagina explorar un laberinto siguiendo siempre la pared derecha. Avanzas por un pasillo hasta llegar a un callejón sin salida, luego retrocedes (backtrack) y tomas el siguiente pasillo disponible.

```
DFS desde 0:
    0 --- 1 --- 3
    |     |
    2 --- 4

Recorrido posible: 0 → 1 → 3 (fin) → backtrack → 1 → 4 → 2 (fin) → backtrack → 0
```

### Stack Implícito

DFS usa la **pila de llamadas recursiva** (o una pila explícita en la versión iterativa). El orden LIFO (Last In, First Out) produce la exploración en profundidad.

---

## 2. DFS Recursivo — Implementación Completa

```cpp
// DFS recursivo estándar — O(N+M)
// CPH Cap. 12 | CP4 §4.2.1

#include <bits/stdc++.h>
using namespace std;

int N, M;
vector<vector<int>> adj;
vector<bool> visited;

// DFS simple — marcar alcanzables desde v
void dfs(int v) {
    visited[v] = true;           // marcar como visitado al entrar
    for (int u : adj[v]) {
        if (!visited[u]) {
            dfs(u);              // explorar recursivamente
        }
    }
    // Al llegar aquí: todos los descendientes de v ya fueron explorados
}

// Contar y clasificar componentes
int count_components(int N, vector<vector<int>>& adj) {
    visited.assign(N, false);
    int components = 0;
    for (int i = 0; i < N; i++) {
        if (!visited[i]) {
            dfs(i);       // explorar toda la componente de i
            components++;
        }
    }
    return components;
}
```

---

## 3. DFS con Timestamps (tin, tout)

Los timestamps son fundamentales para muchos algoritmos sobre árboles y grafos.

```cpp
// DFS con timestamps — tin y tout
// tin[v] = tiempo al ENTRAR a v
// tout[v] = tiempo al SALIR de v (ya procesados todos los descendientes)
// CPH Cap. 18 (LCA) | CP4 §4.7

vector<int> tin, tout;
int timer_dfs = 0;

void dfs_timestamps(int v, int parent) {
    tin[v] = timer_dfs++;      // registrar tiempo de entrada
    
    for (int u : adj[v]) {
        if (u == parent) continue;    // no regresar al padre en árbol
        if (tin[u] == -1) {           // si no visitado
            dfs_timestamps(u, v);
        }
    }
    
    tout[v] = timer_dfs++;     // registrar tiempo de salida
}

// Propiedad clave de timestamps en árbol:
// v es ancestro de u  ⟺  tin[v] <= tin[u] && tout[u] <= tout[v]
bool is_ancestor(int v, int u) {
    return tin[v] <= tin[u] && tout[u] <= tout[v];
}
```

**Diagrama de timestamps:**
```
Árbol:          Recorrido DFS desde 0:
    0
   /|\           Entrar 0 (tin=0)
  1  2  3          Entrar 1 (tin=1)
 /|                  Entrar 4 (tin=2)
4  5                 Salir  4 (tout=3)
                     Entrar 5 (tin=4)
                     Salir  5 (tout=5)
                  Salir  1 (tout=6)
                  Entrar 2 (tin=7)
                  Salir  2 (tout=8)
                  Entrar 3 (tin=9)
                  Salir  3 (tout=10)
               Salir  0 (tout=11)

tin:  [0, 1, 7, 9, 2, 4]
tout: [11, 6, 8, 10, 3, 5]

¿Es 0 ancestro de 4?
tin[0]=0 <= tin[4]=2 && tout[4]=3 <= tout[0]=11 → SÍ ✓
```

---

## 4. DFS Coloring — Detección de Ciclos

Para **grafos dirigidos**, usamos 3 colores:
- `WHITE (0)`: no visitado
- `GRAY (1)`: en la pila de llamadas actual (en proceso)
- `BLACK (2)`: terminado (todos sus descendientes explorados)

```cpp
// Detección de ciclos en grafo DIRIGIDO con 3 colores
// CPH Cap. 16 | CP4 §4.9
// Un back edge (GRAY→GRAY) indica ciclo dirigido

vector<int> color;  // 0=blanco, 1=gris, 2=negro
bool has_cycle;

void dfs_cycle(int v) {
    color[v] = 1;  // GRAY: estoy procesando v
    
    for (int u : adj[v]) {
        if (color[u] == 0) {           // WHITE: árbol edge, continuar
            dfs_cycle(u);
        } else if (color[u] == 1) {    // GRAY: back edge → CICLO DIRIGIDO
            has_cycle = true;
        }
        // Si color[u] == 2 (BLACK): forward/cross edge, ignorar
    }
    
    color[v] = 2;  // BLACK: terminé de procesar v
}

bool detect_cycle_directed(int N, vector<vector<int>>& adj) {
    color.assign(N, 0);
    has_cycle = false;
    for (int i = 0; i < N; i++) {
        if (color[i] == 0) {
            dfs_cycle(i);
        }
    }
    return has_cycle;
}

// Para grafos NO DIRIGIDOS: ciclo si encontramos vecino ya visitado != padre
bool has_cycle_undirected;

void dfs_cycle_undirected(int v, int parent) {
    color[v] = 1;
    for (int u : adj[v]) {
        if (u == parent) continue;          // la arista que nos trajo
        if (color[u] == 1) {               // vecino ya visitado ≠ padre → ciclo
            has_cycle_undirected = true;
            return;
        }
        if (color[u] == 0) dfs_cycle_undirected(u, v);
    }
    color[v] = 2;
}
```

---

## 5. Orden Topológico via DFS

```cpp
// Orden topológico via DFS — solo para DAG
// Idea: agregar al vector CUANDO SE TERMINA de explorar (post-order)
// Luego invertir
// CPH Cap. 16 | CP4 §4.9

vector<int> topo_order;
vector<bool> visited_topo;
bool cycle_found;

void dfs_topo(int v) {
    visited_topo[v] = true;
    for (int u : adj[v]) {
        if (!visited_topo[u]) {
            dfs_topo(u);
        }
        // Si u ya fue visitado pero no está en topo_order → ciclo
        // (para simplificar, usamos 3-coloring en la versión robusta)
    }
    topo_order.push_back(v);   // agregar al SALIR, no al entrar
}

vector<int> topological_sort_dfs(int N) {
    visited_topo.assign(N, false);
    topo_order.clear();
    for (int i = 0; i < N; i++) {
        if (!visited_topo[i]) dfs_topo(i);
    }
    reverse(topo_order.begin(), topo_order.end());
    return topo_order;
}

// ¿Por qué funciona?
// Si hay arista u→v en el DAG, dfs termina de explorar v ANTES que u.
// Por lo tanto, tout[v] < tout[u].
// Al agregar en post-order y revertir: u aparece antes que v.
// Eso es exactamente el orden topológico. ✓
```

---

## 6. Clasificación de Aristas en DFS

Para grafo **dirigido**, las aristas se clasifican según los timestamps:

```
Para arista (u, v):
├── v no visitado → TREE EDGE (arista del árbol DFS)
├── v GRAY (en stack) → BACK EDGE (ciclo dirigido detectado)
├── v BLACK y tin[v] > tin[u] → FORWARD EDGE (u es ancestro de v)
└── v BLACK y tin[v] < tin[u] → CROSS EDGE (ramas separadas del DFS tree)
```

Para grafo **no dirigido**:
```
Para arista (u, v):
├── v no visitado → TREE EDGE
└── v ya visitado y v ≠ padre → BACK EDGE (ciclo)
(No existen forward ni cross edges en no dirigido)
```

```cpp
// Clasificación completa de aristas — grafo dirigido
// Requiere tin[] de DFS previo

void classify_edges(int v, int parent_v) {
    tin[v] = timer_dfs++;
    color[v] = 1;  // GRAY
    
    for (int u : adj[v]) {
        if (color[u] == 0) {
            // TREE EDGE
            classify_edges(u, v);
        } else if (color[u] == 1) {
            // BACK EDGE — ciclo encontrado
        } else {  // color[u] == 2
            if (tin[u] > tin[v]) {
                // FORWARD EDGE
            } else {
                // CROSS EDGE
            }
        }
    }
    
    color[v] = 2;  // BLACK
    tout[v] = timer_dfs++;
}
```

---

## 7. DFS Iterativo (con Stack Explícita)

**¿Cuándo usar?** Cuando N > 10^5 y la recursión puede dar stack overflow.

```cpp
// DFS iterativo — evita stack overflow para N grande
// ⚠️ El orden de visita puede diferir del recursivo
// CPH Cap. 12

void dfs_iterative(int start, int N, vector<vector<int>>& adj) {
    vector<bool> visited(N, false);
    stack<int> st;
    
    st.push(start);
    // NO marcar start como visitado aquí — marcar al sacar
    // (o puedes marcar al encolar para consistencia)
    
    while (!st.empty()) {
        int v = st.top(); st.pop();
        
        if (visited[v]) continue;   // puede estar duplicado en el stack
        visited[v] = true;
        
        // Procesar v aquí
        
        for (int u : adj[v]) {
            if (!visited[u]) {
                st.push(u);
            }
        }
    }
}
```

**Versión más fiel al DFS recursivo (preserva el orden de vecinos):**

```cpp
// DFS iterativo que simula exactamente la recursión
// Usando par {nodo, índice_de_vecino_actual}

void dfs_iterative_faithful(int start, vector<vector<int>>& adj) {
    int N = adj.size();
    vector<bool> visited(N, false);
    // Stack: {nodo, indice_actual_en_adj[nodo]}
    stack<pair<int,int>> st;
    
    visited[start] = true;
    st.push({start, 0});
    
    while (!st.empty()) {
        auto& [v, idx] = st.top();
        
        if (idx == (int)adj[v].size()) {
            // Terminé todos los vecinos de v → post-order
            // Aquí puedes hacer topo_order.push_back(v)
            st.pop();
            continue;
        }
        
        int u = adj[v][idx++];   // vecino actual, avanzar índice
        
        if (!visited[u]) {
            visited[u] = true;
            st.push({u, 0});     // explorar u
        }
    }
}
```

---

## 8. Aplicaciones de DFS

### Verificar Conectividad

```cpp
// El grafo es conexo si DFS desde cualquier nodo visita todos
bool is_connected(int N, vector<vector<int>>& adj) {
    vector<bool> vis(N, false);
    function<void(int)> dfs = [&](int v) {
        vis[v] = true;
        for (int u : adj[v]) if (!vis[u]) dfs(u);
    };
    dfs(0);
    return all_of(vis.begin(), vis.end(), [](bool b){ return b; });
}
```

### Encontrar Componentes y Colorear

```cpp
// Asignar número de componente a cada nodo
vector<int> component(N, -1);
int num_comp = 0;

function<void(int, int)> dfs_comp = [&](int v, int c) {
    component[v] = c;
    for (int u : adj[v]) if (component[u] == -1) dfs_comp(u, c);
};

for (int i = 0; i < N; i++) {
    if (component[i] == -1) dfs_comp(i, num_comp++);
}
```

### Verificar Bipartición

```cpp
// 2-coloring con DFS — verificar si es bipartito
vector<int> color_bip(N, -1);
bool bipartite = true;

function<void(int, int)> dfs_bip = [&](int v, int c) {
    color_bip[v] = c;
    for (int u : adj[v]) {
        if (color_bip[u] == -1) dfs_bip(u, 1-c);       // color opuesto
        else if (color_bip[u] == c) bipartite = false;   // conflicto
    }
};
```

---

## 9. Trampas Comunes y Fixes

### Trampa 1: Stack Overflow para N Grande

```
Problema: DFS recursivo en árbol lineal de 10^6 nodos.
Síntoma: Runtime Error (RE), crash del programa.
Fix: Usar DFS iterativo o aumentar stack size.
     En Linux: ulimit -s unlimited
     En Windows: no hay forma fácil → usar iterativo
```

```cpp
// Fix: DFS iterativo para N > 10^5
// Ver sección 7 arriba
```

### Trampa 2: Olvidar el Parent en Grafos No Dirigidos

```cpp
// MAL: sin controlar el padre, detecta ciclos donde no los hay
void dfs_wrong(int v) {
    visited[v] = true;
    for (int u : adj[v]) {
        if (visited[u]) { /* ciclo? */ }  // FALSO POSITIVO — u puede ser el padre
    }
}

// BIEN: pasar el padre como parámetro
void dfs_correct(int v, int parent) {
    visited[v] = true;
    for (int u : adj[v]) {
        if (u == parent) continue;      // ignorar la arista de regreso al padre
        if (visited[u]) { /* ciclo real */ }
        else dfs_correct(u, v);
    }
}
```

⚠️ **Con aristas múltiples**: si hay dos aristas entre $u$ y $v$, ignorar por índice, no por nodo.

### Trampa 3: No Reinicializar para Múltiples DFS

```cpp
// MAL: si llamas dfs múltiples veces sin reinicializar
color.assign(N, 0);   // ← hacer esto ANTES de cada DFS fresco
timer_dfs = 0;
topo_order.clear();
```

### Trampa 4: Invertir el Orden Topológico

```cpp
// MAL: no invertir topo_order al final
// El último nodo en terminar debe ir PRIMERO
reverse(topo_order.begin(), topo_order.end());  // ← NO olvidar
```

### Trampa 5: Confundir Back Edge en Dirigido vs No Dirigido

```
En DIRIGIDO: back edge = vecino GRAY → ciclo dirigido
En NO DIRIGIDO: back edge = vecino visitado ≠ padre → ciclo

En no dirigido NO existe "forward edge" ni "cross edge" —
todas las aristas no-árbol son back edges.
```

---

## 10. Ejemplo Resuelto — DFS Completo

**Grafo:** Nodos {0,1,2,3,4}, aristas: 0→1, 0→2, 1→3, 2→3, 3→4

```
DFS desde 0 (dirigido):

Estado inicial: color=[W,W,W,W,W], tin=[-1,-1,-1,-1,-1]

timer=0: Entrar 0, color=[G,W,W,W,W], tin=[0,-,-,-,-]
timer=1: Entrar 1 (desde 0), color=[G,G,W,W,W], tin=[0,1,-,-,-]
timer=2: Entrar 3 (desde 1), color=[G,G,W,G,W], tin=[0,1,-,2,-]
timer=3: Entrar 4 (desde 3), color=[G,G,W,G,G], tin=[0,1,-,2,3]
         Salir  4, color=[G,G,W,G,B], tout=[_,_,_,_,4], topo=[4]
         Salir  3, color=[G,G,W,B,B], tout=[_,_,_,5,4], topo=[4,3]
         Salir  1, color=[G,B,W,B,B], tout=[_,6,_,5,4], topo=[4,3,1]
timer=7: Entrar 2 (desde 0), color=[G,B,G,B,B], tin=[0,1,7,2,3]
         Ver 3: ya NEGRO → cross edge (tin[3]=2 < tin[2]=7)
         Salir  2, color=[G,B,B,B,B], tout=[_,6,8,5,4], topo=[4,3,1,2]
         Salir  0, color=[B,B,B,B,B], tout=[9,6,8,5,4], topo=[4,3,1,2,0]

Invertir: topo=[0,2,1,3,4]

Verificar: 0→1✓, 0→2✓, 1→3✓, 2→3✓, 3→4✓ — todas las aristas van en orden ✓
```

---

## 11. Resumen de Complejidades

| Aplicación | Tiempo | Espacio |
|-----------|--------|---------|
| DFS básico | $O(N+M)$ | $O(N)$ stack |
| Detección de ciclos | $O(N+M)$ | $O(N)$ |
| Orden topológico | $O(N+M)$ | $O(N)$ |
| Timestamps (tin/tout) | $O(N+M)$ | $O(N)$ |
| Clasificación de aristas | $O(N+M)$ | $O(N)$ |

---

## 🔗 Relacionado

- [[02_BFS]]
- [[09_SCC]]
- [[10_TOPOLOGICO]]
- [[11_PUENTES_ARTICULACION]]
- [[14_ARBOLES_ESPECIALES]]
- [[17_ERRORES_CONCEPTUALES]]
